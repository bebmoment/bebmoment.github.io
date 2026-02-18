import csv

filename = "worldcities.csv"
d = {}
with open(filename, 'r', newline='', encoding='utf-8') as f:
    reader = csv.reader(f, delimiter=',')
    next(reader) # toss headers
    for (_, city, lat, lng, _, _, _, _, _, _, _) in reader:
        d.setdefault(city, []).extend([lat, lng])

print(d)