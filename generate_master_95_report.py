import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

from generate_report_helpers import set_cell_background, set_cell_margins, set_table_borders, add_callout_box

def create_full_95_page_report():
    doc = docx.Document()
    
    # Page setup - Standard A4 matching Chennai Institute of Technology report template
    for sec in doc.sections:
        sec.page_width = Inches(8.27)
        sec.page_height = Inches(11.69)
        sec.top_margin = Pt(72)
        sec.bottom_margin = Pt(72)
        sec.left_margin = Pt(72)
        sec.right_margin = Pt(54)
        sec.header_distance = Pt(36)
        sec.footer_distance = Pt(36)

    # Styles setup
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Times New Roman'
    style_normal.font.size = Pt(12)
    style_normal.font.color.rgb = RGBColor(0, 0, 0)
    style_normal.paragraph_format.line_spacing = 1.3
    style_normal.paragraph_format.space_after = Pt(6)

    def add_p(text, bold=False, italic=False, size=12, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=6, line_spacing=1.3):
        p = doc.add_paragraph()
        p.alignment = align
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = line_spacing
        if text:
            r = p.add_run(text)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(size)
            r.font.bold = bold
            r.font.italic = italic
            r.font.color.rgb = RGBColor(0, 0, 0)
        return p

    def add_h1(text, space_before=20, space_after=14):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(15)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0, 0, 0)
        return p

    def add_h2(text, space_before=16, space_after=6):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(13)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0, 0, 0)
        return p

    def add_h3(text, space_before=12, space_after=4):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0, 0, 0)
        return p

    def add_bullet(text):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.2
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11.5)
        r.font.color.rgb = RGBColor(0, 0, 0)
        return p

    def add_caption(text, is_table=False):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(10)
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        r.font.bold = True
        return p

    def add_table_data(headers, data, col_widths=None, alignment=WD_TABLE_ALIGNMENT.CENTER):
        tbl = doc.add_table(rows=len(data) + 1, cols=len(headers))
        tbl.alignment = alignment
        set_table_borders(tbl, color="A0A0A0")
        
        hdr_row = tbl.rows[0]
        for col_idx, h_text in enumerate(headers):
            cell = hdr_row.cells[col_idx]
            cell.text = h_text
            set_cell_background(cell, "E6E6E6")
            set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            for r in p.runs:
                r.font.name = 'Times New Roman'
                r.font.size = Pt(10.5)
                r.font.bold = True
                
        for row_idx, row_vals in enumerate(data):
            row = tbl.rows[row_idx + 1]
            bg_color = "F9F9F9" if row_idx % 2 == 1 else "FFFFFF"
            for col_idx, val in enumerate(row_vals):
                cell = row.cells[col_idx]
                cell.text = str(val)
                set_cell_background(cell, bg_color)
                set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
                cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
                p = cell.paragraphs[0]
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT if col_idx > 0 and len(str(val)) > 15 else WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.space_before = Pt(1)
                p.paragraph_format.space_after = Pt(1)
                for r in p.runs:
                    r.font.name = 'Times New Roman'
                    r.font.size = Pt(10)
                    
        if col_widths:
            for row in tbl.rows:
                for idx, w in enumerate(col_widths):
                    row.cells[idx].width = Inches(w)
                    
        p_space = doc.add_paragraph()
        p_space.paragraph_format.space_before = Pt(0)
        p_space.paragraph_format.space_after = Pt(8)
        return tbl

    # =========================================================================
    # PRELIMINARY PAGES (1 to 16)
    # =========================================================================
    print("Generating Preliminary Pages...")
    # Page 1: Title
    add_p("TRAFFICSENSE AI: AN AI-POWERED SMART TRAFFIC INTELLIGENCE PLATFORM FOR PAN-INDIA SMART CITY MANAGEMENT", bold=True, size=15, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=18, space_after=18)
    add_p("A PROJECT REPORT", bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=18)
    add_p("Submitted by", italic=True, size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=6, space_after=12)
    
    t_stud = doc.add_table(rows=2, cols=2)
    t_stud.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in t_stud.rows:
        for c in r.cells:
            c.width = Inches(2.8)
    t_stud.rows[0].cells[0].paragraphs[0].text = "ASHVIKA P"
    t_stud.rows[0].cells[1].paragraphs[0].text = "210425243179"
    t_stud.rows[1].cells[0].paragraphs[0].text = "GITIKA OMPRAKASH"
    t_stud.rows[1].cells[1].paragraphs[0].text = "210425243069"
    for r in t_stud.rows:
        for c in r.cells:
            p = c.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            for run in p.runs:
                run.font.name = "Times New Roman"
                run.font.size = Pt(12)
                run.font.bold = True
    
    add_p("\nin partial fulfillment for the award of the degree of", italic=True, size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=14, space_after=8)
    add_p("BACHELOR OF TECHNOLOGY", bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=4)
    add_p("in", italic=True, size=11, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=2, space_after=4)
    add_p("DEPARTMENT OF ARTIFICIAL INTELLIGENCE AND DATA SCIENCE", bold=True, size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=16)

    cit_logo = r"C:\Users\DELL\Downloads\trafficsense-ai-final\extracted_template_assets\img_0.jpg"
    if os.path.exists(cit_logo):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(6)
        p_logo.paragraph_format.space_after = Pt(14)
        run_logo = p_logo.add_run()
        run_logo.add_picture(cit_logo, width=Inches(1.8))

    add_p("CHENNAI INSTITUTE OF TECHNOLOGY\n(AUTONOMOUS)\n(Affiliated to Anna University, Chennai & Recognized by AICTE New Delhi)\nChennai-600 069", bold=True, size=11, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=6, space_after=18)
    add_p("OCTOBER-2026", bold=True, size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=0)
    doc.add_page_break()

    # Page 2: Vision & Mission Institute
    header_img1 = r"C:\Users\DELL\Downloads\trafficsense-ai-final\extracted_template_assets\img_1.png"
    if os.path.exists(header_img1):
        p_h1 = doc.add_paragraph()
        p_h1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_h1.paragraph_format.space_after = Pt(18)
        p_h1.add_run().add_picture(header_img1, width=Inches(5.8))

    add_h2("Vision of the Institute:")
    add_callout_box(doc, "To be an eminent centre for Academia, Industry and Research by imparting knowledge, relevant practices and inculcating human values to address global challenges through novelty and sustainability.", border_color="#DD6B20")

    add_h2("Mission of the Institute:")
    add_bullet("IM1. To create next generation leader by effective teaching learning methodologies and instill scientific spark in them to meet the global challenges.")
    add_bullet("IM2. To transform lives through deployment of emerging technology, novelty and sustainability.")
    add_bullet("IM3. To inculcate human values and ethical principles to cater the societal needs.")
    add_bullet("IM4. To contributes towards the research ecosystem by providing a suitable, effective platform for interaction between industry, academia and R&D establishments.")
    add_bullet("IM5. To nurture incubation centres enabling structured entrepreneurship and start-ups.")
    doc.add_page_break()

    # Page 3: Vision & Mission Department
    header_img2 = r"C:\Users\DELL\Downloads\trafficsense-ai-final\extracted_template_assets\img_3.png"
    if os.path.exists(header_img2):
        p_h2 = doc.add_paragraph()
        p_h2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_h2.paragraph_format.space_after = Pt(18)
        p_h2.add_run().add_picture(header_img2, width=Inches(5.8))

    add_h2("Vision of the Department:")
    add_callout_box(doc, "To Achieve excellent standards of quality-education by using the latest tools, nurturing collaborative culture and disseminating customer oriented innovations to relevant areas of academia and industry towards serving the greater cause of society.", border_color="#3182CE")

    add_h2("Mission of the Department:")
    add_bullet("DM1. To develop professionals who are skilled in the area of Artificial Intelligence and Data Science.")
    add_bullet("DM2. To impart quality and value based education and contribute towards the innovation of computing, expert system, Data Science to raise satisfaction level of all stakeholders.")
    add_bullet("DM3. Our effort is to apply new advancements in high performance computing hardware and software.")
    doc.add_page_break()

    # Page 4: Certificate
    add_p("CHENNAI INSTITUTE OF TECHNOLOGY (AUTONOMOUS)\n(Affiliated to Anna University, Chennai & AICTE New Delhi)\nChennai-600 069", bold=True, size=11, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=24)
    add_h1("BONAFIDE CERTIFICATE", space_before=12, space_after=20)
    add_p("Certified that this project report “TRAFFICSENSE AI: AN AI-POWERED SMART TRAFFIC INTELLIGENCE PLATFORM FOR PAN-INDIA SMART CITY MANAGEMENT” is the bonafide work of ASHVIKA P (210425243179) and GITIKA OMPRAKASH (210425243069) who carried out the project work under my supervision.", size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=10, space_after=40)

    t_sig = doc.add_table(rows=1, cols=2)
    t_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_sig.rows[0].cells[0].width = Inches(3.2)
    t_sig.rows[0].cells[1].width = Inches(3.2)
    
    c1 = t_sig.rows[0].cells[0].paragraphs[0]
    c1.add_run("Signature\n\n\nHEAD OF THE DEPARTMENT\n").bold = True
    c1.add_run("Department of Artificial Intelligence And\nData Science,\nChennai Institute of Technology,\nKundrathur,\nChennai-600069.")
    
    c2 = t_sig.rows[0].cells[1].paragraphs[0]
    c2.add_run("Signature\n\n\nDr. K. RAMANAN, M.Tech, Ph.D\nPROJECT SUPERVISOR\n").bold = True
    c2.add_run("Associate Professor,\nDepartment of Artificial Intelligence\nAnd Data Science,\nChennai Institute of Technology,\nKundrathur,\nChennai-600069.")
    
    for c in [c1, c2]:
        c.paragraph_format.line_spacing = 1.15
        for r in c.runs:
            r.font.name = "Times New Roman"
            r.font.size = Pt(11)

    add_p("\n\nCertified that the above students have attended a viva voce during the exam held on ……………….......", size=11, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=36, space_after=30)
    add_p("INTERNAL EXAMINER\t\t\t\t\tEXTERNAL EXAMINER", bold=True, size=11, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=0)
    doc.add_page_break()

    # Page 5: Acknowledgement
    add_h1("ACKNOWLEDGEMENT", space_before=12, space_after=20)
    add_p("We express our gratitude to our Chairman Shri. P. SRIRAM and all trust members of Chennai Institute of Technology for providing the facility and opportunity to do this project as a part of our undergraduate course.", align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=8, space_after=10)
    add_p("We are grateful to our Principal Dr. A. RAMESH M.E, Ph.D, for providing us the facility and encouragement during the course of our work.", align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=8, space_after=10)
    add_p("We would like to extend our thanks to our Dean, Dr. V. SRINIVASA RAO M.Tech, PhD, for providing their valuable suggestions throughout this project.", align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=8, space_after=10)
    add_p("We sincerely thank our Head of the Department, Department of Artificial Intelligence & Data Science, for having provided us with valuable guidance, resources and timely suggestions throughout our work.", align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=8, space_after=10)
    add_p("We sincerely thank our Project Supervisor, Dr. K. RAMANAN, M.Tech, Ph.D, Associate Professor, Department of Artificial Intelligence & Data Science, for having provided us with valuable guidance, resources and timely suggestions throughout our work.", align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=8, space_after=10)
    add_p("We would like to extend our thanks to our Project Coordinator, Dr. K. RAMANAN M.Tech, Ph.D, Associate Professor, Department of Artificial Intelligence & Data Science, for his valuable suggestions throughout this project.", align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=8, space_after=10)
    add_p("We wish to extend our sincere thanks to all the Faculty Members of the Department of Artificial Intelligence & Data Science, for their valuable suggestions and their kind cooperation for the successful completion of our project.", align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=8, space_after=10)
    add_p("We wish to acknowledge the help received from the Lab Instructors of the Department of Artificial Intelligence & Data Science, and others for providing valuable suggestions and for the successful completion of the project.", align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=8, space_after=10)
    doc.add_page_break()

    # Pages 6-11: Table of Contents
    add_h1("TABLE OF CONTENTS", space_before=12, space_after=16)
    toc_data = [
        ("ABSTRACT", "i"),
        ("LIST OF FIGURES", "ii"),
        ("LIST OF TABLES", "iv"),
        ("SYMBOLS & ABBREVIATIONS", "v"),
        ("1. INTRODUCTION", "1"),
        ("    1.1 BACKGROUND", "1"),
        ("        1.1.1 Global Context", "2"),
        ("        1.1.2 Indian Context", "3"),
        ("    1.2 PROBLEM STATEMENT", "4"),
        ("        1.2.1 Our Understanding of the Problem", "5"),
        ("        1.2.2 Planned Approach", "6"),
        ("    1.3 TRAFFIC CONGESTION VOLATILITY", "7"),
        ("    1.4 OBJECTIVES", "8"),
        ("        1.4.1 General Objective", "8"),
        ("        1.4.2 Specific Objectives", "9"),
        ("    1.5 IMPORTANCE OF TRAFFIC PREDICTION IN SMART CITIES", "11"),
        ("    1.6 ROLE OF AI AND ML IN TRAFFIC PREDICTION", "12"),
        ("    1.7 SIGNIFICANCE", "13"),
        ("    1.8 SCOPE", "14"),
        ("    1.9 LIMITATIONS OF THE EXISTING SYSTEM", "15"),
        ("    1.10 OVERVIEW OF THE PROPOSED SYSTEM", "16"),
        ("2. LITERATURE REVIEW", "17"),
        ("    2.1 EXISTING RESEARCH", "17"),
        ("    2.2 KEY OBSERVATIONS FROM EXISTING RESEARCH", "21"),
        ("        2.2.1 Traditional Statistical Models", "21"),
        ("        2.2.2 Machine Learning Approaches", "22"),
        ("        2.2.3 Deep Learning & Hybrid Models", "23"),
        ("        2.2.4 Incorporation of External Factors", "24"),
        ("        2.2.5 Decision Support & User-Centric Applications", "25"),
        ("    2.3 GAPS IN EXISTING KNOWLEDGE", "26"),
        ("    2.4 VALUE ADDITION OF THE PROPOSED SYSTEM", "27"),
        ("3. METHODOLOGY", "29"),
        ("    3.1 SYSTEM OVERVIEW", "29"),
        ("    3.2 PROBLEM-SOLVING APPROACH", "31"),
        ("    3.3 TECHNOLOGIES USED", "32"),
        ("        3.3.1 Programming Language", "32"),
        ("        3.3.2 Data Processing and Analytics Libraries", "33"),
        ("        3.3.3 Machine Learning Frameworks", "34"),
        ("        3.3.4 Deep Learning Frameworks", "35"),
        ("        3.3.5 Forecasting Models", "36"),
        ("        3.3.6 Web Application and Visualization Technologies", "37"),
        ("        3.3.7 Data Storage and Management", "38"),
        ("        3.3.8 Development Environment and Tools", "39"),
        ("        3.3.9 Version Control", "39"),
        ("        3.3.10 Evaluation Metrics and Tools", "40"),
        ("    3.4 SYSTEM ARCHITECTURE", "41"),
        ("        3.4.1 Data Sources Layer", "42"),
        ("        3.4.2 Data Ingestion and Storage Layer", "43"),
        ("        3.4.3 Processing and Analytics Layer", "44"),
        ("        3.4.4 Forecasting Engine (AI/ML Layer)", "45"),
        ("        3.4.5 Presentation Layer", "46"),
        ("        3.4.6 System Integration and Workflow", "47"),
        ("        3.4.7 Non-Functional Considerations", "48"),
        ("    3.5 DATA COLLECTION", "49"),
        ("    3.6 DATA PREPROCESSING", "50"),
        ("    3.7 FEATURE ENGINEERING", "51"),
        ("    3.8 FORECASTING MODELS AND EXPERIMENTAL SETUP", "53"),
        ("        3.8.1 Random Forest (RF) Model", "53"),
        ("        3.8.2 Long Short-Term Memory (LSTM) Model", "54"),
        ("        3.8.3 Hybrid Models (LSTM + RF)", "55"),
        ("    3.9 MODEL TRAINING AND EVALUATION", "56"),
        ("        3.9.1 Data Splitting", "56"),
        ("        3.9.2 Model Training", "57"),
        ("        3.9.3 Model Evaluation", "57"),
        ("    3.10 OUTPUT GENERATION AND VISUALIZATION", "58"),
        ("        3.10.1 Web-Based Dashboard", "58"),
        ("        3.10.2 Interactive Visualizations", "59"),
        ("        3.10.3 Decision-Support Features", "59"),
        ("        3.10.4 Usability and Interpretability", "60"),
        ("    3.11 EXISTING SYSTEM AND PROPOSED WORK", "60"),
        ("        3.11.1 Existing System", "60"),
        ("        3.11.2 Proposed Work", "61"),
        ("4. IMPLEMENTATION AND DEVELOPMENT PROCESS", "63"),
        ("    4.1 OVERVIEW OF SYSTEM IMPLEMENTATION", "63"),
        ("    4.2 SYSTEM MODULES AND IMPLEMENTATION DETAILS", "64"),
        ("        4.2.1 Data Sources Module", "64"),
        ("        4.2.2 Data Ingestion and Storage Module", "65"),
        ("        4.2.3 Processing and Analytics Module", "66"),
        ("        4.2.4 Forecasting Engine Module", "67"),
        ("        4.2.5 Web Application Module", "68"),
        ("        4.2.6 Non-Functional Requirements Module", "69"),
        ("    4.3 VISUAL REPRESENTATION OF THE SYSTEM", "70"),
        ("    4.4 CHALLENGES AND MITIGATION STRATEGIES", "75"),
        ("5. TESTING AND VALIDATION", "76"),
        ("    5.1 INTRODUCTION TO SYSTEM TESTING", "76"),
        ("    5.2 TESTING OBJECTIVES", "76"),
        ("    5.3 TESTING STRATEGY", "77"),
        ("    5.4 TEST ENVIRONMENT AND CONFIGURATION", "77"),
        ("    5.5 UNIT TESTING", "78"),
        ("        5.5.1 Data Collection Module Testing", "78"),
        ("        5.5.2 Data Preprocessing Module Testing", "78"),
        ("        5.5.3 Feature Engineering Module Testing", "79"),
        ("        5.5.4 Forecasting Model Module Testing", "79"),
        ("        5.5.5 Visualization Module Testing", "79"),
        ("    5.6 INTEGRATION TESTING", "80"),
        ("        5.6.1 Data Pipeline Integration Testing", "80"),
        ("        5.6.2 Model and Backend Integration Testing", "80"),
        ("        5.6.3 Backend and Web Dashboard Integration Testing", "80"),
        ("    5.7 FUNCTIONAL TESTING", "81"),
        ("        5.7.1 Data Upload and Input Validation", "81"),
        ("        5.7.2 Congestion Prediction Testing", "81"),
        ("        5.7.3 Forecast Visualization Testing", "81"),
        ("        5.7.4 User Interaction Testing", "82"),
        ("    5.8 MACHINE LEARNING MODEL VALIDATION", "82"),
        ("        5.8.1 Training and Testing Data Validation", "82"),
        ("        5.8.2 Cross-Validation", "83"),
        ("        5.8.3 Prediction Error Validation", "83"),
        ("        5.8.4 Model Comparison Validation", "84"),
        ("    5.9 PERFORMANCE TESTING", "84"),
        ("        5.9.1 Prediction Response Time", "84"),
        ("        5.9.2 Processing Performance", "85"),
        ("        5.9.3 Resource Utilization", "85"),
        ("    5.10 USABILITY TESTING", "85"),
        ("    5.11 SECURITY AND RELIABILITY TESTING", "86"),
        ("    5.12 TEST CASES AND RESULTS", "86"),
        ("    5.13 DEFECT IDENTIFICATION AND RECTIFICATION", "87"),
        ("    5.14 TESTING SUMMARY", "88"),
        ("6. RESULTS AND DISCUSSIONS", "89"),
        ("    6.1 EXPERIMENTAL OBSERVATIONS AND ANALYSIS", "89"),
        ("        6.1.1 Experimental Setup", "89"),
        ("        6.1.2 Evaluation Metrics", "89"),
        ("        6.1.3 Quantitative Performance Analysis", "90"),
        ("        6.1.4 Prediction Accuracy Evaluation", "90"),
        ("        6.1.5 Prediction Performance and Model Comparison", "91"),
        ("        6.1.6 Model Stability and Robustness Analysis", "91"),
        ("        6.1.7 Seasonality Pattern Analysis", "92"),
        ("        6.1.8 Market Trend Learning and Responsiveness", "92"),
        ("        6.1.9 Visual Analysis of Forecast Results", "93"),
        ("        6.1.10 Practical Implications of the Proposed System", "93"),
        ("        6.1.11 Overall Discussion", "94"),
        ("7. CONCLUSION", "95"),
        ("    7.1 SUMMARY OF THE WORK", "95"),
        ("    7.2 KEY CONTRIBUTIONS", "95"),
        ("    7.3 ACHIEVEMENT OF OBJECTIVES", "96"),
        ("    7.4 LIMITATIONS", "96"),
        ("    7.5 FUTURE ENHANCEMENTS", "96"),
        ("REFERENCES", "97"),
        ("APPENDIX", "99"),
        ("PO & PSO ATTAINMENT", "102"),
        ("RESEARCH PAPER", "104")
    ]
    
    t_toc = doc.add_table(rows=len(toc_data) + 1, cols=3)
    t_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_toc, color="FFFFFF")
    t_toc.rows[0].cells[0].paragraphs[0].text = "CHAPTER NO."
    t_toc.rows[0].cells[1].paragraphs[0].text = "TITLE"
    t_toc.rows[0].cells[2].paragraphs[0].text = "PAGE NO."
    for c in t_toc.rows[0].cells:
        p = c.paragraphs[0]
        p.runs[0].font.name = "Times New Roman"
        p.runs[0].font.size = Pt(11)
        p.runs[0].font.bold = True
    t_toc.rows[0].cells[0].width = Inches(1.2)
    t_toc.rows[0].cells[1].width = Inches(4.5)
    t_toc.rows[0].cells[2].width = Inches(0.9)
    
    for idx, (title, page) in enumerate(toc_data):
        row = t_toc.rows[idx + 1]
        row.cells[0].width = Inches(1.2)
        row.cells[1].width = Inches(4.5)
        row.cells[2].width = Inches(0.9)
        parts = title.strip().split(" ", 1)
        ch_no = ""
        t_text = title.strip()
        if parts[0].endswith(".") or parts[0].replace(".", "").isdigit():
            ch_no = parts[0]
            t_text = parts[1] if len(parts) > 1 else ""
        
        row.cells[0].paragraphs[0].text = ch_no
        row.cells[1].paragraphs[0].text = t_text
        row.cells[2].paragraphs[0].text = page
        
        is_major = not title.startswith(" ") and ("." in ch_no or ch_no == "" and any(k in title for k in ["ABSTRACT", "LIST", "SYMBOLS", "REFERENCES", "APPENDIX", "PO", "RESEARCH"]))
        for col_i in range(3):
            p = row.cells[col_i].paragraphs[0]
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.15
            if col_i == 2:
                p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            for run in p.runs:
                run.font.name = "Times New Roman"
                run.font.size = Pt(10)
                if is_major:
                    run.font.bold = True
                    
    doc.add_page_break()

    # Abstract
    add_h1("ABSTRACT", space_before=12, space_after=18)
    add_p("Rapid urbanization and explosive vehicular population growth across Indian metropolitan and tier-1 cities have escalated traffic congestion into a critical socio-economic crisis. Urban congestion severely hampers economic productivity, deteriorates air quality through elevated tailpipe emissions, inflates fuel consumption, and imposes severe psychological stress on daily commuters. Traditional traffic monitoring frameworks and legacy intelligent transportation systems (ITS) rely predominantly on reactive signal control, static physical induction loops, or linear statistical time-series models (such as ARIMA) that fail to capture the highly complex, non-linear, spatial-temporal dependencies and abrupt volatility of urban traffic dynamics. Furthermore, legacy systems lack integration with real-time exogenous environmental factors such as precipitation, extreme weather events, high-capacity arterial road capacities, and localized peak-hour commute surges.", align=WD_ALIGN_PARAGRAPH.JUSTIFY)
    add_p("To overcome these fundamental challenges, this project introduces “TrafficSense AI”, an advanced artificial intelligence and machine learning predictive traffic intelligence platform engineered specifically for Pan-India smart city management. The proposed system formulates urban traffic forecasting as a high-dimensional spatial-temporal learning problem across 20+ major Indian metropolitan centers (including Chennai, Mumbai, Delhi NCR, Bengaluru, and Hyderabad) encompassing over 120 critical transit zones. By integrating comprehensive multi-source datasets—including historical hourly vehicle volumes, real-time sensor telematics, road geometry indices, weather conditions (clear, cloudy, light rain, heavy rain), and temporal commute vectors—TrafficSense AI provides predictive foresight into traffic congestion before gridlock manifests.", align=WD_ALIGN_PARAGRAPH.JUSTIFY)
    add_p("The core computational architecture incorporates a hybrid AI-ML modeling framework combining Random Forest (RF) regressors with Long Short-Term Memory (LSTM) recurrent neural networks. The Random Forest component isolates non-linear interactions among heterogeneous environmental, temporal, and spatial variables while producing interpretable feature attribution scores. Concurrently, the LSTM network captures deep sequential dependencies and long-term recurring temporal cycles inherent in commuter behavior. To bridge the gap between predictive modeling and municipal action, TrafficSense AI delivers an interactive, high-performance web dashboard featuring real-time zone congestion scoring (0–100%), predicted commute delays, dynamic average speed forecasts, route optimization algorithms, and proactive AI rerouting recommendations. Experimental validation demonstrates that the hybrid RF-LSTM architecture outperforms baseline statistical approaches, achieving a Mean Absolute Error (MAE) of 9.8%, Root Mean Square Error (RMSE) of 13.4, and an impressive overall AI prediction accuracy of 94.2%. Consequently, TrafficSense AI equips urban planners, traffic authorities, and commuters with actionable intelligence, fostering data-driven governance and resilient smart city mobility ecosystems across India.", align=WD_ALIGN_PARAGRAPH.JUSTIFY)
    add_p("Keywords: Traffic Congestion Prediction, Spatial-Temporal Modeling, Long Short-Term Memory (LSTM), Random Forest, Hybrid AI-ML Framework, Smart Cities, Intelligent Transportation Systems, Route Optimization, Pan-India Urban Mobility.", bold=True, size=11, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=6, space_after=0)
    doc.add_page_break()

    # List of Figures & Tables
    add_h1("LIST OF FIGURES", space_before=12, space_after=16)
    figures_list = [
        ("1.1", "Influencing Factors for Traffic Congestion Prediction", "7"),
        ("1.2", "Proposed TrafficSense AI System Objectives", "9"),
        ("3.1", "End-to-End System Architecture of Hybrid Traffic Congestion Forecasting System", "41"),
        ("3.2", "Hybrid Forecasting Architecture (LSTM + Random Forest Ensemble)", "55"),
        ("4.1", "Data Sources Module Architecture", "64"),
        ("4.2", "Data Ingestion and Storage Module", "65"),
        ("4.3", "Processing and Analytics Module", "66"),
        ("4.4", "Forecasting Engine Architecture", "67"),
        ("4.5", "Web Application Module and User Interaction Layer", "68"),
        ("4.6", "Non-Functional Engineering Requirements Module", "69"),
        ("4.7", "TrafficSense AI Landing Page Interface", "70"),
        ("4.8", "Pan-India Metropolitan Traffic Intelligence Overview", "71"),
        ("4.9", "Real-Time Traffic Forecasting Dashboard Interface", "72"),
        ("4.10", "Multi-City, Urban Zone and Weather Selection Module", "73"),
        ("4.11", "Commute Time Window and Horizon Selection Module", "74"),
        ("4.12", "Zone Congestion Score and Speed Prediction Summary", "74"),
        ("4.13", "Dynamic Diurnal Traffic Trend Analysis Curve", "74"),
        ("4.14", "Overall Congestion Distribution and Severity Breakdown", "75"),
        ("4.15", "Listing of Monitored Metro Zones and Arterial Corridors", "75"),
        ("4.16", "T Nagar Commercial Corridor Traffic Profile Overview", "75"),
        ("4.17", "Anna Nagar Arterial Traffic Profile Overview", "75"),
        ("4.18", "Velachery Transit Hub Traffic Profile Overview", "75"),
        ("4.19", "Guindy Industrial Corridor Traffic Profile Overview", "75"),
        ("4.20", "Hourly Peak-Hour Congestion Forecast Trend Table", "75"),
        ("4.21", "24-Hour Day-Night Traffic Flow Comparison Graph", "75"),
        ("5.1", "Performance Comparison of Existing and Proposed Models", "82"),
        ("5.2", "Error Metric Comparison Graph (MAE, RMSE, MAPE)", "83"),
        ("5.3", "Model Stability Comparison Graph Across Temporal Windows", "83"),
        ("5.4", "Peak Hourly Pattern and Seasonality Comparison Graph", "84"),
        ("5.5", "Market / Traffic Trend Detection Accuracy Comparison Graph", "84"),
        ("5.6", "Actual vs Forecasted Traffic Congestion Trend Curve Using Hybrid RF-LSTM Model", "84")
    ]
    t_fig = doc.add_table(rows=len(figures_list) + 1, cols=3)
    t_fig.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_fig, color="D0D0D0")
    t_fig.rows[0].cells[0].paragraphs[0].text = "Figure No."
    t_fig.rows[0].cells[1].paragraphs[0].text = "Title"
    t_fig.rows[0].cells[2].paragraphs[0].text = "Page No."
    for c in t_fig.rows[0].cells:
        set_cell_background(c, "EAEAEA")
        p = c.paragraphs[0]
        p.runs[0].font.name = "Times New Roman"
        p.runs[0].font.size = Pt(11)
        p.runs[0].font.bold = True
    for idx, (f_no, title, page) in enumerate(figures_list):
        row = t_fig.rows[idx + 1]
        row.cells[0].paragraphs[0].text = f_no
        row.cells[1].paragraphs[0].text = title
        row.cells[2].paragraphs[0].text = page
        for col_i in range(3):
            p = row.cells[col_i].paragraphs[0]
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(1)
            if col_i == 2 or col_i == 0: p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in p.runs:
                run.font.name = "Times New Roman"
                run.font.size = Pt(10)
    doc.add_page_break()

    # List of Tables
    add_h1("LIST OF TABLES", space_before=12, space_after=16)
    tables_list = [
        ("1.1", "Descriptive Statistics of Collected Urban Traffic Flow and Congestion Data", "7"),
        ("1.2", "Comparative Performance of Forecasting Models on Traffic Congestion Prediction", "8"),
        ("1.3", "Importance of Traffic Forecasting for Different Urban Mobility Stakeholders", "11"),
        ("3.1", "Dataset Schema and Multi-Source Ingestion Description", "49"),
        ("3.2", "Data Preprocessing and Normalization Techniques", "50"),
        ("3.3", "Engineered Feature Categories and Mathematical Formulations", "51"),
        ("3.4", "Existing Traffic Monitoring Systems vs Proposed TrafficSense AI Platform", "61"),
        ("4.1", "Implementation Challenges and Solutions Adopted", "75"),
        ("5.1", "Error Metric Comparison Between Existing and Proposed Models", "82"),
        ("5.2", "Performance Comparison of Individual and Hybrid Machine Learning Models", "83"),
        ("5.3", "Model Stability and Variance Comparison Between Existing and Proposed Models", "83"),
        ("5.4", "Peak Hour and Seasonality Pattern Error Comparison", "84"),
        ("5.5", "Congestion Trend Detection Accuracy Comparison", "84"),
        ("5.6", "System Requirement-to-Outcome Engineering Mapping", "86"),
        ("5.7", "Societal and Practical Impact Analysis of the Proposed TrafficSense AI Platform", "87")
    ]
    t_tbl = doc.add_table(rows=len(tables_list) + 1, cols=3)
    t_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_tbl, color="D0D0D0")
    t_tbl.rows[0].cells[0].paragraphs[0].text = "Table No."
    t_tbl.rows[0].cells[1].paragraphs[0].text = "Title"
    t_tbl.rows[0].cells[2].paragraphs[0].text = "Page No."
    for c in t_tbl.rows[0].cells:
        set_cell_background(c, "EAEAEA")
        p = c.paragraphs[0]
        p.runs[0].font.name = "Times New Roman"
        p.runs[0].font.size = Pt(11)
        p.runs[0].font.bold = True
    for idx, (t_no, title, page) in enumerate(tables_list):
        row = t_tbl.rows[idx + 1]
        row.cells[0].paragraphs[0].text = t_no
        row.cells[1].paragraphs[0].text = title
        row.cells[2].paragraphs[0].text = page
        for col_i in range(3):
            p = row.cells[col_i].paragraphs[0]
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(1)
            if col_i == 2 or col_i == 0: p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in p.runs:
                run.font.name = "Times New Roman"
                run.font.size = Pt(10)
    doc.add_page_break()

    # Symbols & Abbreviations
    add_h1("SYMBOLS & ABBREVIATIONS", space_before=12, space_after=16)
    abbreviations = [
        ("AI", "Artificial Intelligence"),
        ("ML", "Machine Learning"),
        ("DL", "Deep Learning"),
        ("ITS", "Intelligent Transportation Systems"),
        ("ARIMA", "Auto-Regressive Integrated Moving Average"),
        ("LSTM", "Long Short-Term Memory"),
        ("RF", "Random Forest"),
        ("RMSE", "Root Mean Square Error"),
        ("MAE", "Mean Absolute Error"),
        ("MAPE", "Mean Absolute Percentage Error"),
        ("TDNN", "Time-Delay Neural Network"),
        ("VAR", "Vector Auto-Regression"),
        ("XGBoost", "Extreme Gradient Boosting"),
        ("CNN", "Convolutional Neural Network"),
        ("TCN", "Temporal Convolutional Network"),
        ("GRU", "Gated Recurrent Unit"),
        ("STGCN", "Spatial-Temporal Graph Convolutional Network"),
        ("ETL", "Extract, Transform, Load"),
        ("GPS", "Global Positioning System"),
        ("API", "Application Programming Interface"),
        ("UI/UX", "User Interface / User Experience"),
        ("SVG", "Scalable Vector Graphics"),
        ("REST", "Representational State Transfer"),
        ("JSON", "JavaScript Object Notation"),
        ("PCA", "Principal Component Analysis"),
        ("KPI", "Key Performance Indicator")
    ]
    t_abbr = doc.add_table(rows=len(abbreviations) + 1, cols=2)
    t_abbr.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_abbr, color="D0D0D0")
    t_abbr.rows[0].cells[0].paragraphs[0].text = "Acronym"
    t_abbr.rows[0].cells[1].paragraphs[0].text = "Expansion"
    for c in t_abbr.rows[0].cells:
        set_cell_background(c, "EAEAEA")
        p = c.paragraphs[0]
        p.runs[0].font.name = "Times New Roman"
        p.runs[0].font.size = Pt(11)
        p.runs[0].font.bold = True
    for idx, (acr, exp) in enumerate(abbreviations):
        row = t_abbr.rows[idx + 1]
        row.cells[0].paragraphs[0].text = acr
        row.cells[1].paragraphs[0].text = exp
        for col_i in range(2):
            p = row.cells[col_i].paragraphs[0]
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(1)
            for run in p.runs:
                run.font.name = "Times New Roman"
                run.font.size = Pt(10)
                if col_i == 0: run.font.bold = True
    doc.add_page_break()

    # =========================================================================
    # DETAILED EXPANDED CHAPTERS
    # =========================================================================
    print("Generating Exhaustive Chapters with Deep Academic Depth...")

    # Load and execute chapter generator modules
    import generate_chapters_deep
    generate_chapters_deep.append_all_chapters(doc, add_p, add_h1, add_h2, add_h3, add_bullet, add_caption, add_table_data)

    output_path = r"C:\Users\DELL\Downloads\trafficsense-ai-final\TrafficSense_AI_Academic_Project_Report.docx"
    doc.save(output_path)
    print(f"Deep report generated successfully: {output_path}")

if __name__ == '__main__':
    create_full_95_page_report()
