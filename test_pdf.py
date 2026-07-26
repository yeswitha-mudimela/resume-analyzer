import pdfplumber

with pdfplumber.open("resume.pdf") as pdf:
    for page in pdf.pages:
        print(page.extract_text())