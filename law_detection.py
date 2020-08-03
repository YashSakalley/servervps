import spacy
import nltk
from spacy import displacy
from collections import Counter, defaultdict
import en_core_web_sm
import re
import sys
from sys import stdout
from nltk.stem import WordNetLemmatizer, porter
from nltk.corpus import util


class detect():
    def __init__(self):
        self.weapon = {'hammer': True, 'knife': True, 'gun': True, 'bat': True}
        self.offence = {'murder': [300, 'XVI'], 'robbery': ['390-402', 'XVII'], 'theft': [
            '378-382', 'XVII'], 'cheating': ['415-420', 'XVII'], 'attempt': [511, 'XXIII']}
        self.crime = []
        self.support = {}
        self.dic = {'PERSON': 'People',
                    'NORP': 'Nationalities/Political/Religious',
                    'FAC': 'Infrastructure',
                    'ORG': 'Organization',
                    'GPE': 'County/City/State',
                    'LOC': 'Mountain/Water/Canal/Forest',
                    'PRODUCT': 'Object',
                    'EVENT': 'Event',
                    'WORK_OF_ART': 'Books/songs/etc',
                    'LAW': 'Stuff related to law',
                    'LANGUAGE': 'Any named language',
                    'DATE': 'Date',
                    'TIME': 'Time',
                    'PERCENT': '%',
                    'MONEY': 'Money',
                    'Quantity': 'Quantity',
                    'ORDINAL': 'First/Second/etc',
                    'CARDINAL': 'Cannot be determined'
                    }
        self.weapon_flag = False
        self.theft_flag = False

    def template(self, l):

        result = ''
        for i in l:
            temp = self.offence[i]
            result += '{} under IPC Chapter {}, Section {} \n'.format(
                i.upper(), temp[1], temp[0])
        return result

    def update_support(self, lbl, txt):
        for i in lbl.split('/'):
            self.support[i] = txt
        return

    def process_text(self, text):

        nlp = en_core_web_sm.load()
        data = nlp(text)

        for i in data.ents:
            self.update_support(self.dic[i.label_], i.text)

        return text.lower()

    def enter_main(self, text):

        wnl = WordNetLemmatizer()

        text = self.process_text(text)
        # print(text)
        theft = {'robbed': 1, 'thretened': 1, 'forcefully': 1}
        murder = {'murdered': 1, 'killed': 1}

        # if else ladder for passing right IPC sections to the resultant output
        for i, j in enumerate(text.split(' ')):
            j = wnl.lemmatize(j)
            # print(j)
            if j in self.weapon:
                self.weapon_flag = True

            if j in self.offence:
                if j == 'theft' and self.weapon == True:
                    self.crime.append('robbery')
                else:
                    self.crime.append(j)

            if j in theft:
                self.crime.append('robbery')
                self.theft_flag = True
            if j in murder:
                self.crime.append('murder')

    def output(self):
        # print(self.theft_flag,self.weapon_flag)
        # print(self.crime)
        # print('===================================================')
        print(self.template(self.crime))
        stdout.flush()


if __name__ == '__main__':
    text = ''
    for i in sys.argv[1:]:
        text += i+' '

    x = detect()
    x.enter_main(text)
    x.output()
