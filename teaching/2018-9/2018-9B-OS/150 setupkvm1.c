void *setupkvm1() {
	unsigned long *tbl0, *tbl1;
	unsigned long i0, i1;
	
	if ((tbl0 = kalloc()) == 0)
		return (NULL);
		
	for (i0 = 0; i0 < 1024; i0++) tbl0[i0] = 0;
	
	for (i0 = 512; (i0 << 22) < PHYSTOP; i0++) {
		if ((tbl1 = kalloc()) == 0)
			goto bad;
		tbl0[i0] = (tbl1 & 0x7FFFFFFF) | 3;
		for (i1 = 0; i1 < 1024; i1++) tbl1[i1] = 0;
		
		for (i1 = 0; i1 < 1024; i1++) {
			if ((i0 << 22) + (i1 << 12)) >= PHYSTOP)
				break;
				
			tbl1[i1] = ((i0 & 511) << 22) + (i1 << 12) | 3;
		}
	}
	
	for (i0 = 0xfe000000; i0 != 0; i0 += (1<<22))) {
		if ((tbl1 = kalloc()) == 0)
			goto bad;
		tbl0[i0 >> 22] = (tbl1 & 0x7FFFFFFF) | 3;
		for (i1 = 0; i1 < 1024; i1++) tbl1[i1] = 0;
		
		for (i1 = 0; i1 < 1024; i1++)
			tbl1[i1] = i0  + (i1 << 12) | 3;
	}

	return (tbl0);
	
bad:
	for (i0 = 512; i0 < 1024 ; i++)
		if (tbl0[i0] != 0)
			kfree((tbl0[i0) & ~4095)) | 0x80000000);

	kfree(tbl0);
	return (NULL);
}