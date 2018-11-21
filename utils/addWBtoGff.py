#!/usr/bin/env python

# add WormBase gene IDs to the information column for genes in a gff 
# (which uses systematic gene names as the parent ID) to allow searching on 
# WormBase (which uses WBG ids) from Jbrowse track

# ids are csv direct from WormBase: WB,common,systematic

import sys
import pandas as pd

gffin, ids, gffout = sys.argv[1:]
# gffin = 'WS220_gene.gff'
# ids = 'c_elegans.WS220.geneIDs.txt'
# gffout = 'test.gff'

ids = pd.read_csv(ids,header=None).drop(1, axis=1)
gff = pd.read_csv(gffin, sep='\t', header=None)

ids.columns = ['wb', 'sys']

# WBG ids will be added to Coding_transcript genes only (already exist for nc)
gix = (gff[1]=='Coding_transcript') & (gff[2]=='gene')
gffg = gff.loc[gix]
gffg = gffg.assign(sys = gffg[8].apply(lambda i: i.split(':')[1]))
# print(gffg.shape)
gffg = pd.merge(gffg, ids, on='sys')
gffg = gffg.assign(o = gffg[8] + ';Alias=' + gffg['wb'])
# print(gffg.shape)
gffg = gffg[[0,1,2,3,4,5,6,7,'o']]

gffo = gff.loc[~gix]
gffg.columns = gffo.columns
gffo = pd.concat([gffo, gffg])
gffo = gffo.sort_values(by = [0,3])
gffo.to_csv(gffout, header=None, sep = '\t', index=0)

