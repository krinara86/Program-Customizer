// ===========================
// PDF Generation Functions
// ===========================

async function saveSadhakaReportAsPdf() {
  const asanasMap = await loadAsanasForPdf();
  const pdf = new jspdf.jsPDF('p', 'pt', 'a4');
  const sadhakaName = document.getElementById('sadhakaName').value;

  // Updated colors - white background with beige borders
  const colors = {
    primaryPurple: [122, 149, 168],    // #7A95A8 (Deep blue variant for headers)
    lavenderAccent: [187, 201, 210],   // #BBC9D2 (Your blue for accents)
    textDark: [58, 58, 58],            // #3A3A3A (Charcoal for body text)
    textMuted: [116, 138, 153],        // #748A99 (Soft gray-blue for subtitles)
    whiteBg: [255, 255, 255],          // #FFFFFF (White for backgrounds - CHANGED)
    borderBeige: [231, 217, 203],      // #E7D9CB (Your beige for borders - CHANGED)
    borderLight: [187, 201, 210],      // #BBC9D2 (Your blue for borders)
    cardBg: [255, 255, 255]            // #FFFFFF (White for content cards)
  };

  const pdfConfig = {
    pageWidth: pdf.internal.pageSize.width,
    pageHeight: pdf.internal.pageSize.height,
    margin: 60,  // Increased for more elegant spacing
  };
  const contentWidth = pdfConfig.pageWidth - (2 * pdfConfig.margin);
  const centerX = pdfConfig.pageWidth / 2;

  // ===========================
  // TITLE PAGE - White background with beige border
  // ===========================
  
  // White background for entire page
  pdf.setFillColor(...colors.whiteBg);
  pdf.rect(0, 0, pdfConfig.pageWidth, pdfConfig.pageHeight, 'F');
  
  // Beige border around the page
  pdf.setDrawColor(...colors.borderBeige);
  pdf.setLineWidth(3);
  pdf.rect(15, 15, pdfConfig.pageWidth - 30, pdfConfig.pageHeight - 30, 'S');

  let titleY = 100;

  // Decorative line at top
  pdf.setDrawColor(...colors.lavenderAccent);
  pdf.setLineWidth(2.5);
  const topLineWidth = 60;
  pdf.line(centerX - topLineWidth / 2, titleY, centerX + topLineWidth / 2, titleY);
  titleY += 40;

  // Add logo - centered with shadow effect
  const logoUrl = 'https://images.squarespace-cdn.com/content/v1/62f11860fb33eb592879527c/73af335a-bc0d-4450-a4c0-32ad86ceb033/neue+weisse+blumen+logo.png';
  try {
    const logoWidth = 100;
    const logoHeight = 100;
    let logoDataUri = await urlToDataUri(logoUrl);
    
    // Fix WebP format - convert to PNG if needed
    if (logoDataUri && logoDataUri.includes('data:image/webp')) {
      logoDataUri = await convertWebPtoPNG(logoDataUri);
    }
    
    if (logoDataUri) {
      // Shadow effect (multiple light circles)
      pdf.setFillColor(93, 78, 109, 0.1);
      pdf.circle((pdfConfig.pageWidth - logoWidth) / 2 + logoWidth / 2, titleY + logoHeight / 2 + 3, logoWidth / 2 + 5, 'F');
      
      // Add logo
      const format = logoDataUri.includes('data:image/png') ? 'PNG' : 'JPEG';
      pdf.addImage(logoDataUri, format, (pdfConfig.pageWidth - logoWidth) / 2, titleY, logoWidth, logoHeight);
    }
  } catch (e) {
    console.error("Could not add logo to PDF:", e);
    // Draw a placeholder circle if logo fails
    pdf.setFillColor(...colors.primaryPurple);
    pdf.circle(centerX, titleY + 50, 50, 'F');
  }
  titleY += 140;

  // Main Title - Serif-style formatting
  pdf.setFontSize(38);
  pdf.setFont("times", "normal");
  pdf.setTextColor(...colors.primaryPurple);
  pdf.text("Personal Practice Plan", centerX, titleY, { align: 'center' });
  titleY += 10;

  // Subtitle with letter spacing effect
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...colors.textMuted);
  const subtitle = "Y O G A   S A D H A N A";
  pdf.text(subtitle, centerX, titleY, { align: 'center' });
  titleY += 40;

  // Decorative line below title
  pdf.setDrawColor(...colors.lavenderAccent);
  pdf.setLineWidth(1);
  const bottomLineWidth = 180;
  pdf.line(centerX - bottomLineWidth / 2, titleY, centerX + bottomLineWidth / 2, titleY);
  titleY += 60;

  // "Prepared for" label
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...colors.textMuted);
  const prepLabel = "P R E P A R E D   F O R";
  pdf.text(prepLabel, centerX, titleY, { align: 'center' });
  titleY += 20;

  // Student name - italic serif
  pdf.setFontSize(30);
  pdf.setFont("times", "italic");
  pdf.setTextColor(...colors.textDark);
  pdf.text(sadhakaName, centerX, titleY, { align: 'center' });
  titleY += 60;

  // Date section with border
  const dateBoxY = titleY;
  const dateBoxWidth = 300;
  const dateBoxHeight = 60;
  const dateBoxX = (pdfConfig.pageWidth - dateBoxWidth) / 2;
  
  pdf.setDrawColor(...colors.borderBeige);
  pdf.setLineWidth(1);
  pdf.line(dateBoxX, dateBoxY, dateBoxX + dateBoxWidth, dateBoxY);
  pdf.line(dateBoxX, dateBoxY + dateBoxHeight, dateBoxX + dateBoxWidth, dateBoxY + dateBoxHeight);
  
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...colors.textMuted);
  const dateLabel = "D A T E";
  pdf.text(dateLabel, centerX, dateBoxY + 25, { align: 'center' });

  pdf.setFontSize(16);
  pdf.setFont("times", "normal");
  pdf.setTextColor(...colors.textDark);
  pdf.text(currentDate, centerX, dateBoxY + 45, { align: 'center' });

  // Organization name at bottom
  pdf.setFontSize(15);
  pdf.setFont("times", "normal");
  pdf.setTextColor(...colors.primaryPurple);
  pdf.text("Self Realization with Radhikaji", centerX, pdfConfig.pageHeight - 80, { align: 'center' });

  // ===========================
  // LIABILITY PAGE - White background with beige border
  // ===========================
  pdf.addPage();
  
  // White background
  pdf.setFillColor(...colors.whiteBg);
  pdf.rect(0, 0, pdfConfig.pageWidth, pdfConfig.pageHeight, 'F');
  
  // Beige border
  pdf.setDrawColor(...colors.borderBeige);
  pdf.setLineWidth(3);
  pdf.rect(15, 15, pdfConfig.pageWidth - 30, pdfConfig.pageHeight - 30, 'S');
  
  let y = pdfConfig.margin;

  // Section header with bottom border
  pdf.setFontSize(22);
  pdf.setFont("times", "normal");
  pdf.setTextColor(...colors.primaryPurple);
  pdf.text("Important Notice", pdfConfig.margin, y);
  y += 5;
  
  pdf.setDrawColor(...colors.lavenderAccent);
  pdf.setLineWidth(2.5);
  pdf.line(pdfConfig.margin, y, pdfConfig.pageWidth - pdfConfig.margin, y);
  y += 25;


  // Add liability statement with justified text
  const LIABILITY_STATEMENT = `This document has not been created by a medical doctor or healing practitioner. Therefore, please perform all practices mentioned in this document at your own discretion. 

If you have or have had an injury or acute illness, or if you have doubts about whether yoga practices are appropriate for you, you are responsible for contacting your physician as needed to inquire about your fitness level.

The instructions and advice given in yoga sessions are no substitute for professional medical or psychological care. The instructions and advice given in the following document is not a substitute for professional medical or psychological care. 

If you are pregnant or experiencing menopausal transition, you are responsible for taking special care of yourself and consulting your doctor as needed.

If you are menstruating, do not exceed your comfort levels.

In order for yoga practice to be beneficial for you and your all-round health, please let us know if you are suffering from physical illness or have any other health restrictions that would prevent you from participating in yoga practice or in individual yoga exercises. 

In case of severe health issues or chronic illness(es) please check with your doctor whether you are allowed to participate in the yoga related activities. Participation is at your own risk.

The use of any suggested devices or equipment such as the indoor bike, resistance bands, chairs, pillows or any other props is at the yoga participant's own risk.

Any cardio training suggested is to be practiced at your own discretion.`;

  pdf.setTextColor(...colors.textDark);
  pdf.setFontSize(12);
  pdf.setFont("times", "normal");
  y = addText(pdf, LIABILITY_STATEMENT, pdfConfig.margin, y, {
    ...pdfConfig,
    size: 12,
    font: 'times',
    style: 'normal',
    maxWidth: contentWidth,
    currentY: y,
    colors: colors
  });

  // ===========================
  // MAIN CONTENT PAGES - White background with beige border
  // ===========================
  pdf.addPage();
  
  // White background for content pages
  pdf.setFillColor(...colors.whiteBg);
  pdf.rect(0, 0, pdfConfig.pageWidth, pdfConfig.pageHeight, 'F');
  
  // Beige border
  pdf.setDrawColor(...colors.borderBeige);
  pdf.setLineWidth(3);
  pdf.rect(15, 15, pdfConfig.pageWidth - 30, pdfConfig.pageHeight - 30, 'S');
  
  y = pdfConfig.margin;

  const sectionElementsInOrder = Array.from(document.querySelectorAll('.section'));
  const sortedCategories = sectionElementsInOrder.map(sectionEl => {
    return CATEGORIES.find(cat => cat.id === sectionEl.id);
  }).filter(Boolean);

  for (const category of sortedCategories) {
    let categoryHasContent = false;
    let notes = '';

    // Check for section-level notes
    if (category.notesId) {
      const notesElement = document.getElementById(category.notesId);
      if (notesElement) {
        notes = normalizeText(notesElement.value);
        if (notes) categoryHasContent = true;
      }
    }

    if (category.type === 'text') {
      const content = normalizeText(document.getElementById(category.elementId).value);
      if (content && content.trim() !== '' &&
        content !== normalizeText(DEFAULT_PRAYER_TEXT) &&
        content !== normalizeText(DEFAULT_DIET_TEXT) &&
        content !== normalizeText(DEFAULT_ROUTINE_TEXT) &&
        content !== normalizeText(DEFAULT_LIABILITY_TEXT) &&
        content !== normalizeText(DEFAULT_REFERENCE_BOOKS_TEXT)) {
        categoryHasContent = true;
      }
    } else if (category.type === 'asanas') {
      const containerDiv = document.getElementById(category.elementId);
      if (containerDiv && containerDiv.children.length > 0) {
        categoryHasContent = true;
      }
    }

    if (!categoryHasContent) continue;

    let sectionIntroHeightEstimate = 48;
    if (notes) {
      const splitNotes = pdf.splitTextToSize(`Notes: ${notes}`, contentWidth);
      sectionIntroHeightEstimate += splitNotes.length * 14 + 10;
    }

    if (y + sectionIntroHeightEstimate > pdfConfig.pageHeight - pdfConfig.margin) {
      pdf.addPage();
      
      // Apply white background to new page
      pdf.setFillColor(...colors.whiteBg);
      pdf.rect(0, 0, pdfConfig.pageWidth, pdfConfig.pageHeight, 'F');
      
      // Beige border
      pdf.setDrawColor(...colors.borderBeige);
      pdf.setLineWidth(3);
      pdf.rect(15, 15, pdfConfig.pageWidth - 30, pdfConfig.pageHeight - 30, 'S');
      
      y = pdfConfig.margin;
    }

    // Section header with beige border box
    const sectionHeaderHeight = 35;
    pdf.setFillColor(...colors.whiteBg);
    pdf.setDrawColor(...colors.borderBeige);
    pdf.setLineWidth(2);
    pdf.rect(pdfConfig.margin, y - 5, contentWidth, sectionHeaderHeight, 'S');
    
    pdf.setFontSize(22);
    pdf.setFont("times", "normal");
    pdf.setTextColor(...colors.primaryPurple);
    pdf.text(category.title, pdfConfig.margin + 10, y + 18);
    y += sectionHeaderHeight + 15;

    if (notes) {
      pdf.setFont("times", "italic");
      pdf.setTextColor(...colors.textDark);
      y = addText(pdf, `Notes: ${notes}`, pdfConfig.margin, y, {
        ...pdfConfig,
        size: 12,
        font: 'times',
        style: 'italic',
        maxWidth: contentWidth,
        currentY: y,
        colors: colors
      });
      y += 10;
    }

    if (category.type === 'text') {
      let content = normalizeText(document.getElementById(category.elementId).value);
      
      // If content is empty and there's a default text defined, use it
      if (!content && category.defaultText) {
        const defaultTextConstantName = category.defaultText;
        switch(defaultTextConstantName) {
          case 'DEFAULT_PRAYER_TEXT':
            content = normalizeText(DEFAULT_PRAYER_TEXT);
            break;
          case 'DEFAULT_MEDITATION_TEXT':
            content = normalizeText(DEFAULT_MEDITATION_TEXT);
            break;
          case 'DEFAULT_REFERENCE_BOOKS_TEXT':
            content = normalizeText(DEFAULT_REFERENCE_BOOKS_TEXT);
            break;
        }
      }
      
      if (content) {
        pdf.setTextColor(...colors.textDark);
        y = addText(pdf, content, pdfConfig.margin, y, {
          ...pdfConfig,
          size: 12,
          font: 'times',
          style: 'normal',
          maxWidth: contentWidth,
          currentY: y,
          colors: colors
        });
      }
    } else if (category.type === 'asanas') {
      const containerDiv = document.getElementById(category.elementId);
      if (containerDiv && containerDiv.children.length > 0) {
        for (let i = 0; i < containerDiv.children.length; i++) {
          y = await addAsanaContent(pdf, containerDiv.children[i], {
            ...pdfConfig,
            y: y
          }, asanasMap, colors);
        }
      }
    }
    y += 20;
  }

  // Add copyright notice at the end of the last page
  const totalPages = pdf.internal.getNumberOfPages();
  pdf.setPage(totalPages);

  // Position copyright at bottom of last page
  pdf.setFontSize(10);
  pdf.setFont('times', 'italic');
  pdf.setTextColor(...colors.textMuted);
  pdf.text("Copyright Sadhana Software", pdfConfig.pageWidth / 2, pdfConfig.pageHeight - 60, {
    align: 'center'
  });

  // Add page numbers to all pages (skip title and liability pages)
  for (let i = 3; i <= totalPages; i++) {
    pdf.setPage(i);
    
    // Page number in footer
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...colors.textMuted);
    pdf.text(`Page ${i - 2} of ${totalPages - 2}`, pdfConfig.pageWidth / 2, pdfConfig.pageHeight - 30, {
      align: 'center'
    });
  }

  // Generate filename with date
  const dateStr = new Date().toISOString().split('T')[0];
  pdf.save(`${sadhakaName}_sadhana_plan_${dateStr}.pdf`);
}

async function loadAsanasForPdf() {
  const returnAsanas = new Map();

  try {
    const querySnapshot = await db.collection('asanas').get();
    querySnapshot.forEach((doc) => {
      const asana = doc.data();
      returnAsanas.set(asana.name, asana.description);
    });

    console.log("Fetched Asana descriptions for PDF generation.");
    return returnAsanas;
  } catch (error) {
    console.log("Error fetching Asanas:", error);
    throw error;
  }
}

async function addAsanaContent(pdf, asanaDiv, pdfConfig, asanasMap, colors) {
  const asanaNameSelect = asanaDiv.querySelector('.asanaNameSelect');
  if (!asanaNameSelect || !asanaNameSelect.value) {
    return pdfConfig.y;
  }

  let y = pdfConfig.y;
  const asanaName = asanaNameSelect.value;
  const repetitionsInput = asanaDiv.querySelector('#repetitionsInput');
  const specialNotesTextarea = asanaDiv.querySelector('#specialNotesTextarea');
  const contentWidth = pdfConfig.pageWidth - (2 * pdfConfig.margin);

  try {
    const asanaDoc = await db.collection('asanas').where("name", "==", asanaName).get();
    if (asanaDoc.empty) return y;

    const asanaData = asanaDoc.docs[0].data();

    const displayName = normalizeText(asanaData.displayName || asanaData.name);
    const repetitions = repetitionsInput ? normalizeText(repetitionsInput.value) : '';
    const specialNotes = specialNotesTextarea ? normalizeText(specialNotesTextarea.value) : '';
    const description = normalizeText(asanasMap.get(asanaName));

    // Calculate required height
    let requiredHeight = 0;
    requiredHeight += pdf.splitTextToSize(displayName, contentWidth).length * 14;
    requiredHeight += 10;

    if (asanaData.imageUrl) {
      requiredHeight += 200;
    }

    if (repetitions) {
      requiredHeight += 20;
    }
    if (specialNotes) {
      requiredHeight += pdf.splitTextToSize(specialNotes, contentWidth).length * 14;
      if (repetitions) requiredHeight += 5;
    }
    if (description) {
      requiredHeight += pdf.splitTextToSize(description, contentWidth).length * 14;
      if (repetitions || specialNotes) requiredHeight += 5;
    }
    requiredHeight += 50;  // Extra padding for card

    if (y + requiredHeight > pdfConfig.pageHeight - pdfConfig.margin) {
      pdf.addPage();
      
      // Apply white background to new page
      pdf.setFillColor(...colors.whiteBg);
      pdf.rect(0, 0, pdfConfig.pageWidth, pdfConfig.pageHeight, 'F');
      
      // Beige border
      pdf.setDrawColor(...colors.borderBeige);
      pdf.setLineWidth(3);
      pdf.rect(15, 15, pdfConfig.pageWidth - 30, pdfConfig.pageHeight - 30, 'S');
      
      y = pdfConfig.margin;
    }

    // ===========================
    // ASANA CARD - White background with beige border
    // ===========================
    const cardStartY = y;
    const cardPadding = 25;
    const cardContentWidth = contentWidth - (2 * cardPadding);
    
    // We'll draw the card rectangle after we know the height
    const cardContentStartY = y + cardPadding;
    let cardY = cardContentStartY;

    // Add Image inside card
    if (asanaData.imageUrl) {
      try {
        let base64data = await urlToDataUri(asanaData.imageUrl);
        
        // Fix WebP format
        if (base64data && base64data.includes('data:image/webp')) {
          base64data = await convertWebPtoPNG(base64data);
        }
        
        if (base64data) {
          // Get actual image dimensions to preserve aspect ratio
          const imgDimensions = await getImageDimensions(base64data);
          const maxWidth = 160;
          const maxHeight = 160;
          
          // Calculate scaled dimensions while preserving aspect ratio
          let imageWidth = imgDimensions.width;
          let imageHeight = imgDimensions.height;
          
          // Scale down if needed
          if (imageWidth > maxWidth || imageHeight > maxHeight) {
            const widthRatio = maxWidth / imageWidth;
            const heightRatio = maxHeight / imageHeight;
            const ratio = Math.min(widthRatio, heightRatio);
            
            imageWidth = imageWidth * ratio;
            imageHeight = imageHeight * ratio;
          }
          
          const imageX = (pdfConfig.pageWidth - imageWidth) / 2;

          // Light background for image with beige border
          pdf.setFillColor(250, 248, 245);  // Very light cream
          pdf.setDrawColor(...colors.borderBeige);
          pdf.rect(imageX, cardY, imageWidth, imageHeight, 'FD');
          
          // Add image
          const format = base64data.includes('data:image/png') ? 'PNG' : 'JPEG';
          pdf.addImage(base64data, format, imageX, cardY, imageWidth, imageHeight);

          cardY += imageHeight + 20;
        }
      } catch (e) {
        console.error("Error adding image:", e);
      }
    }

    // Asana Display Name - centered, italic serif
    pdf.setFontSize(17);
    pdf.setFont("times", "italic");
    pdf.setTextColor(...colors.primaryPurple);
    pdf.text(displayName, pdfConfig.pageWidth / 2, cardY, { align: 'center' });
    cardY += 20;

    // Content section inside card
    const detailsStartX = pdfConfig.margin + cardPadding;
    
    if (repetitions) {
      pdf.setFontSize(11);
      pdf.setFont("times", "bold");
      pdf.setTextColor(...colors.primaryPurple);
      pdf.text("Repetitions: ", detailsStartX, cardY);
      
      pdf.setFont("times", "normal");
      pdf.setTextColor(...colors.textDark);
      pdf.text(repetitions, detailsStartX + 65, cardY);
      cardY += 16;
    }

    if (specialNotes) {
      pdf.setFontSize(11);
      pdf.setFont("times", "bold");
      pdf.setTextColor(...colors.primaryPurple);
      pdf.text("Special Notes: ", detailsStartX, cardY);
      
      pdf.setFont("times", "normal");
      pdf.setTextColor(...colors.textDark);
      const noteLines = pdf.splitTextToSize(specialNotes, cardContentWidth - 85);
      pdf.text(noteLines, detailsStartX + 85, cardY);
      cardY += (noteLines.length * 13) + 8;
    }

    // Description
    if (description) {
      pdf.setFont("times", "normal");
      pdf.setTextColor(...colors.textDark);
      pdf.setFontSize(11);
      const descLines = pdf.splitTextToSize(description, cardContentWidth);
      pdf.text(descLines, detailsStartX, cardY);
      cardY += descLines.length * 13;
    }

    cardY += cardPadding;
    const cardHeight = cardY - cardStartY;

    // Draw the card border with beige color
    pdf.setFillColor(...colors.cardBg);
    pdf.setDrawColor(...colors.borderBeige);
    pdf.setLineWidth(2);
    pdf.rect(pdfConfig.margin, cardStartY, contentWidth, cardHeight, 'S');

    return cardY + 15;
  } catch (error) {
    console.error("Error in addAsanaContent:", error);
    return y;
  }
}

function normalizeText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let processedText = text.trim()
    .replace(/\r\n/g, '\n');  // Normalize all line endings to \n

  // Preserve paragraph breaks (\n\n or \n \n etc.) by replacing them with a unique token
  const paragraphToken = '||PARAGRAPH_BREAK||';
  processedText = processedText.replace(/\n\s*\n+/g, paragraphToken);

  // Replace all remaining single newlines (which are not paragraph breaks) with a space
  processedText = processedText.replace(/\n/g, ' ');

  // Restore the paragraph breaks
  processedText = processedText.replace(new RegExp(paragraphToken.replace(/\|/g, '\\|'), 'g'), '\n\n');
  
  // Clean up excessive whitespace
  processedText = processedText.replace(/[ \t]+/g, ' ');
  
  // Ensure paragraphs are properly spaced
  return processedText.split('\n\n').map(p => p.trim()).filter(p => p.length > 0).join('\n\n');
}

function addText(pdf, text, x, y, options) {
  const { maxWidth, font, size, style, margin = 60, colors } = options;
  const lineHeight = size * 1.6;  // Increased for Option 2 elegance
  const paragraphSpacing = size * 1.0;  // Extra space between paragraphs
  const pageHeight = pdf.internal.pageSize.height;
  const pageWidth = pdf.internal.pageSize.width;

  pdf.setFont(font, style);
  pdf.setFontSize(size);

  // Split text into paragraphs
  const paragraphs = text.split('\n\n');
  
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    if (!paragraph.trim()) continue;
    
    // Split paragraph into lines (for bullet points, etc.)
    const lines = pdf.splitTextToSize(paragraph, maxWidth);
    const blockHeight = lines.length * lineHeight;
    
    // Check if we need a new page
    if (y + blockHeight > pageHeight - margin) {
      pdf.addPage();
      
      // Apply white background to new page
      if (colors) {
        pdf.setFillColor(...colors.whiteBg);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Beige border
        pdf.setDrawColor(...colors.borderBeige);
        pdf.setLineWidth(3);
        pdf.rect(15, 15, pageWidth - 30, pageHeight - 30, 'S');
      }
      
      y = margin;
    }
    
    // Add the paragraph
    pdf.text(lines, x, y);
    y += blockHeight;
    
    // Add extra spacing between paragraphs (but not after the last one)
    if (i < paragraphs.length - 1) {
      y += paragraphSpacing;
    }
  }
  
  return y;
}

function urlToDataUri(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then(blob => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    })
    .catch(error => {
      console.error('Error fetching image:', error);
      return null;
    });
}

function getImageDimensions(base64data) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = (error) => {
      console.error('Error loading image for dimensions:', error);
      // Return default dimensions if image fails to load
      resolve({ width: 180, height: 180 });
    };
    img.src = base64data;
  });
}

async function convertWebPtoPNG(webpDataUri) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image to canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      // Convert to PNG
      const pngDataUri = canvas.toDataURL('image/png');
      resolve(pngDataUri);
    };
    img.onerror = (error) => {
      console.error('Error converting WebP to PNG:', error);
      resolve(webpDataUri);  // Return original if conversion fails
    };
    img.src = webpDataUri;
  });
}
