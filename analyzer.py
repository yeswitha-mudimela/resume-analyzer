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
         suggestion=f"you have no {keyword} sections.add it "
         suggestions.append(suggestion)
   return suggestions