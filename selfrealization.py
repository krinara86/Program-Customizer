import json
import os
import sys

from PyQt5.QtGui import QIntValidator, QPalette, QColor
from PyQt5.QtWidgets import QScrollArea, QApplication, QWidget, QVBoxLayout, QPushButton, \
    QComboBox, QLineEdit, QTextEdit, QLabel, QGridLayout, QMessageBox, QRadioButton
from PyQt5.QtWidgets import QStyleFactory
from fpdf import FPDF


def clean_string(s):
    return s.encode('latin-1', 'ignore').decode('latin-1')


def get_json_file_path(filepath):
    if getattr(sys, 'frozen', False):
        # Executable path in PyInstaller environment
        bundle_dir = sys._MEIPASS
    else:
        # Running as a script
        bundle_dir = os.path.dirname(os.path.abspath(__file__))

    json_file_path = os.path.join(bundle_dir, filepath)
    return json_file_path


class UnicodePDF(FPDF):
    def __init__(self, sadhaka_name, orientation='P', unit='mm', format='A4'):
        super().__init__(orientation, unit, format)
        self.sadhaka_name = sadhaka_name

    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'Sadhaka Report for ' + self.sadhaka_name, align='C')
        self.ln(10)

    def chapter_title(self, title):
        self.set_font('Arial', 'B', 14)
        self.cell(0, 10, title, align='L')
        self.ln(10)

    def chapter_body(self, content):
        self.set_font('Arial', '', 12)
        self.multi_cell(0, 10, content)
        self.ln()

    def chapter(self, title, content):
        self.add_page()
        self.chapter_title(title)
        self.chapter_body(content)


class AsanaRow(QWidget):
    def __init__(self, asanas, day_type=None, practice=None, parent=None):
        super().__init__(parent)

        self.asana_dropdown = QComboBox()
        self.asana_dropdown.addItems([asana['name'] for asana in asanas])

        self.duration_entry = QLineEdit()
        self.duration_entry.setValidator(QIntValidator(0, 99))  # Only allow positive integers upto 99
        self.duration_entry.setFixedWidth(40)
        self.notes_entry = QTextEdit()
        self.notes_entry.setMaximumWidth(1000)

        self.delete_button = QPushButton("-")
        self.delete_button.setFixedWidth(40)
        self.delete_button.clicked.connect(self.delete)

        self.cardio_button = QRadioButton("Cardio")
        self.non_cardio_button = QRadioButton("Non-Cardio")
        if day_type == "cardio":
            self.cardio_button.setChecked(True)
        else:
            self.non_cardio_button.setChecked(True)

        layout = QGridLayout()
        layout.addWidget(self.asana_dropdown, 0, 0)  # Changed row index to 0
        layout.addWidget(self.duration_entry, 0, 1)  # Changed row index to 0
        layout.addWidget(self.cardio_button, 0, 2)  # Added this line
        layout.addWidget(self.non_cardio_button, 0, 3)  # Added this line
        layout.addWidget(self.notes_entry, 1, 0, 1, 4)  # Changed row index to 1 and column span to 4
        layout.addWidget(self.delete_button, 1, 4)  # Changed row index to 1

        self.delete_button.setText('-')  # Change button text to minus sign
        self.delete_button.setStyleSheet("QPushButton { color: red }")  # Change button color to red

        self.setLayout(layout)

        if practice:
            index = self.asana_dropdown.findText(practice['asana'])
            if index >= 0:
                self.asana_dropdown.setCurrentIndex(index)
            self.duration_entry.setText(str(practice['duration']))
            self.notes_entry.setText(practice['additionalNotes'])

    def delete(self):
        self.setParent(None)

    def get_values(self):
        return {
            'day_type': 'cardio' if self.cardio_button.isChecked() else 'nonCardio',
            'asana': self.asana_dropdown.currentText(),
            'duration': int(self.duration_entry.text()),
            'additionalNotes': self.notes_entry.toPlainText()
        }


class SadhakaApp(QWidget):
    def __init__(self):
        super().__init__()

        self.json_file_path = get_json_file_path('asanas.json')
        self.sadhakas_file_path = get_json_file_path('sadhakas.json')

        self.asanas = json.load(open(self.json_file_path))['asanas']
        self.sadhakas = json.load(open(self.sadhakas_file_path))['sadhakas']

        self.sadhaka_dropdown = QComboBox()
        self.sadhaka_dropdown.addItems([sadhaka['name'] for sadhaka in self.sadhakas])
        self.sadhaka_dropdown.currentTextChanged.connect(self.load_asanas)

        self.asana_rows = []

        self.add_asana_button = QPushButton("Add New Asana")
        self.add_asana_button.clicked.connect(self.add_asana_row)

        self.save_button = QPushButton("Save Sadhaka")
        self.save_button.clicked.connect(self.save_sadhaka)

        self.save_pdf_button = QPushButton("Save to PDF")
        self.save_pdf_button.clicked.connect(self.save_to_pdf)

        # Create a widget for the scroll area
        self.scrollWidget = QWidget()
        self.scrollLayout = QVBoxLayout(self.scrollWidget)

        # Create a scroll area and set its widget
        self.scrollArea = QScrollArea()
        self.scrollArea.setWidgetResizable(True)
        self.scrollArea.setWidget(self.scrollWidget)

        layout = QVBoxLayout()
        layout.addWidget(QLabel("Select Sadhaka"))
        layout.addWidget(self.sadhaka_dropdown)
        layout.addWidget(self.scrollArea)  # add scroll area instead of rows directly
        layout.addWidget(self.add_asana_button)
        layout.addWidget(self.save_button)
        layout.addWidget(self.save_pdf_button)
        self.setLayout(layout)

        self.load_asanas()

    def load_asanas(self):
        for row in self.asana_rows:
            row.delete()
        self.asana_rows.clear()

        selected_sadhaka = self.sadhaka_dropdown.currentText()
        for sadhaka in self.sadhakas:
            if sadhaka['name'] == selected_sadhaka:
                for day_type, practices in sadhaka['practiceDays'].items():
                    for practice in practices:
                        self.add_asana_row(day_type, practice)

    def add_asana_row(self, day_type=None, practice=None):
        if day_type is None and practice is None:
            msgBox = QMessageBox()
            msgBox.setText("Is this Asana for a Cardio or Non-Cardio day?")
            msgBox.addButton(QPushButton('Cardio'), QMessageBox.YesRole)
            msgBox.addButton(QPushButton('Non-Cardio'), QMessageBox.NoRole)
            ret = msgBox.exec_()
            day_type = 'cardio' if ret == 0 else 'nonCardio'

        row = AsanaRow(self.asanas, day_type, practice)
        self.asana_rows.append(row)
        self.scrollLayout.addWidget(row)  # add row to the scroll layout

    def save_sadhaka(self):
        selected_sadhaka = self.sadhaka_dropdown.currentText()
        for sadhaka in self.sadhakas:
            if sadhaka['name'] == selected_sadhaka:
                sadhaka['practiceDays']['cardio'] = [row.get_values() for row in self.asana_rows if
                                                     row.cardio_button.isChecked()]
                sadhaka['practiceDays']['nonCardio'] = [row.get_values() for row in self.asana_rows if
                                                        row.non_cardio_button.isChecked()]  # Fixed typo
            with open(self.sadhakas_file_path, 'w') as f:
                json.dump({"sadhakas": self.sadhakas}, f)

    def save_to_pdf(self):
        selected_sadhaka = self.sadhaka_dropdown.currentText()
        for sadhaka in self.sadhakas:
            if sadhaka['name'] == selected_sadhaka:
                pdf = UnicodePDF(sadhaka['name'])

                pdf.add_page()
                pdf.set_font("Helvetica", size=10)
                pdf.cell(0, 10, txt=clean_string(f"Sadhaka: {sadhaka['name']}"), ln=True)

                asanas = json.load(open(self.json_file_path))['asanas']
                for practice_day, practice_details in sadhaka['practiceDays'].items():
                    pdf.set_font("Helvetica", size=10, style='B')
                    pdf.cell(0, 10, txt=clean_string(practice_day.capitalize()), ln=True)
                    for practice in practice_details:
                        asana_name = practice['asana']
                        asana_description = ""
                        for asana in asanas:
                            if asana['name'] == asana_name:
                                asana_description = asana['description']
                                break
                        pdf.set_font("Helvetica", size=10)
                        pdf.cell(0, 10, txt=clean_string(asana_name), ln=True)
                        pdf.line(10, pdf.get_y(), 200, pdf.get_y())  # Add separator line
                        pdf.cell(0, 10, txt=clean_string(f"Duration: {practice['duration']} minutes"), ln=True)
                        pdf.line(10, pdf.get_y(), 200, pdf.get_y())  # Add separator line
                        pdf.cell(0, 10, txt=clean_string(f"Additional Notes: {practice['additionalNotes']}"), ln=True)
                        pdf.cell(0, 10, txt="Description:", ln=True)
                        pdf.set_font("Helvetica", size=8)

                        description_lines = asana_description.count(
                            '\n') + 1  # counts the number of lines in the description
                        image_height = (description_lines * 10) + 30  # calculate the height based on line count

                        # Set the X,Y coordinates for the image (e.g., 10, pdf.get_y())
                        pdf.image("asana.png", x=10, y=pdf.get_y(),
                                  h=image_height)  # specify width 'w' as per your requirement
                        # Set the X,Y coordinates for the description (e.g., 100, pdf.get_y())
                        pdf.set_xy(100, pdf.get_y())  # set the X, Y coordinate for the text
                        pdf.multi_cell(0, 10, txt=clean_string(asana_description), align='L')

                        # adjust the y position
                        pdf.set_y(max(pdf.get_y(),
                                      image_height + 100))  # it takes the maximum y value between the end of image and end of the text

                    # pdf.add_page()

                pdf.output('sadhaka_report.pdf')
                QMessageBox.information(self, "Save to PDF", "Sadhaka details saved to PDF successfully!")
                break


def main():
    app = QApplication([])
    app.setStyle(QStyleFactory.create('Fusion'))

    # Set up palette for customization
    palette = QPalette()
    palette.setColor(QPalette.Window, QColor(242, 242, 242))
    palette.setColor(QPalette.WindowText, QColor(53, 53, 53))
    palette.setColor(QPalette.Base, QColor(255, 255, 255))
    palette.setColor(QPalette.AlternateBase, QColor(242, 242, 242))
    palette.setColor(QPalette.ToolTipBase, QColor(255, 255, 255))
    palette.setColor(QPalette.ToolTipText, QColor(53, 53, 53))
    palette.setColor(QPalette.Text, QColor(53, 53, 53))
    palette.setColor(QPalette.Button, QColor(242, 242, 242))
    palette.setColor(QPalette.ButtonText, QColor(53, 53, 53))
    palette.setColor(QPalette.BrightText, QColor(255, 0, 0))
    palette.setColor(QPalette.Highlight, QColor(76, 163, 224))
    palette.setColor(QPalette.HighlightedText, QColor(255, 255, 255))

    app.setPalette(palette)

    sadhaka_app = SadhakaApp()
    sadhaka_app.showMaximized()

    app.exec_()


if __name__ == "__main__":
    main()
