#!/bin/bash

# add WBG ids as alias to gene features
# and remove an orphan
(cd ../raw_data && ../utils/addWBtoGff.py WS220_gene.gff c_elegans.WS220.geneIDs.txt WS220_gene_wb.gff && grep -v "Parent=Transcript:Y74C9A.3.1" WS220_gene_wb.gff > tmp && mv tmp WS220_gene_wb.gff)

# add the track
../bin/remove-track.pl -D --trackLabel WS220_genes --dir ../data
../bin/flatfile-to-json.pl --trackLabel WS220_genes --trackType CanvasFeatures --urltemplate "https://wormbase.org/species/c_elegans/gene/{alias}" --gff ../raw_data/WS220_gene_wb.gff --out ../data


