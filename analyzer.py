import re

def analyser (inp,wordlist):
    result = {}
    for keyword in wordlist:
        result[keyword] = bool(re.search(r'\b' + keyword.lower() + r'\b', inp.lower()))
    return result

def scorecalculator(result):
    add=sum(result.values())
    score= (add/len(result))*10
    return round(score,1)

def section_checker_v2(text, section_aliases):
    result = {}
    for section, aliases in section_aliases.items():
        result[section] = any(alias in text.lower() for alias in aliases)
    return result

def suggestor(result):
    suggestions=[]
    for keyword, found in result.items():
         if found==False:
            suggestion=f"add {keyword} to your skills"
            suggestions.append(suggestion)
    return suggestions  

def section_checker(missing_section):
   suggestions=[]
   for keyword, found in missing_section.items():
      if found==False:
         if keyword == "experience":
            suggestion = "No experience section found.consider adding an internships section "
         else:
            suggestion = f"you have no {keyword} section. add it"
         suggestions.append(suggestion)
   return suggestions

def formatting_checker(text):
    suggestions = []
    
    if len(text.split()) < 100:
        suggestions.append("Your resume has very little readable text. It may be too heavily designed. ATS cannot read it properly.")
    
    lines = text.split("\n")
    long_lines = [line for line in lines if len(line) > 70]
    if len(long_lines) > 1:
        suggestions.append("Your resume may have a two-column layout. ATS struggles to read columns — consider switching to a single column format.")
    
    symbol_count = text.count("|") + text.count("█") + text.count("•••")
    if symbol_count > 5:
        suggestions.append("Your resume contains special symbols that may confuse ATS parsers. Keep formatting simple.")
    
    return suggestions