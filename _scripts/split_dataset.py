import splitfolders

# set dataset source
input = 'D:/Dataset/EuroSAT'
# set dataset output path
output = 'D:/Dataset/EuroSAT 6-2-2'

# splitfolders.ratio("input folder", "output folder", ratio = (train ratio, validation ratio, testing ratio)) 
splitfolders.ratio(input, output, ratio = (.6, .2, .2))
