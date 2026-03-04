import os
from bs4 import BeautifulSoup
import glob
import re

files = glob.glob('*.html')
for f in files:
    path = os.path.join(os.getcwd(), f)
    with open(path, 'r', encoding='utf-8') as fh:
        text = fh.read()
    # remove weird characters that might be corrupted emojis
    cleaned = re.sub(r'[\x80-\xFF]', '', text)
    soup = BeautifulSoup(cleaned, 'html.parser')
    # remove ad-placeholder elements
    for ad in soup.select('.ad-placeholder'):
        ad.decompose()
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write(str(soup))
    print('Cleaned', f)
