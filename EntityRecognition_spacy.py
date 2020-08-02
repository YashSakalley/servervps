import spacy
from spacy import displacy
from collections import Counter
import en_core_web_sm
import sys
import re

nlp = en_core_web_sm.load()


def process_tags(text,flag = False):
        data = nlp(text)
        if flag:
                dic = {'PERSON':'People',
                        'NORP':'Nationalities/Political/Relegious Groups',
                'FAC':'Infrastructure',
                'ORG':'Organization',
                'GPE':'County/City/State',
                'LOC':'Mountain/Water/Canal/Forest',
                'PRODUCT':'Object',
                'EVENT':'Event',
                'WORK_OF_ART':'Books/songs/etc',
                'LAW':'Stuff related to law',
                'LANGUAGE':'Any named language',
                'DATE':'Date',
                'TIME':'Time',
                'PERCENT':'%',
                'MONEY':'Money',
                'Quantity':'Quantity',
                'ORDINAL':'First/Second/etc',
                'CARDINAL':'Cannot be determined'
                }

                print([(x.text,dic[x.label_]) for x in data.ents])
        else:
                html = displacy.render(data,jupyter=False,style='ent')
                pat = re.compile('<span.*span>')
                # output = re.sub(pat,'',html)
                print(html)


text = ""
for i in sys.argv[1:]:
        text+=i+' '

process_tags(text)
sys.stdout.flush()
