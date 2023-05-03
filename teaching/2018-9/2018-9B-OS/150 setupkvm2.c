//
// Same semantics as setupkvm1
//
void *setupkvm2() {
	unsigned long *tbl0, *tbl1, addr;
	unsigned long addr, i0, i1;
	
	if ((tbl0 = kalloc()) == 0)
		return (NULL);
		
	for (i0 = 0; i < 1024; i++) tbl0[i0] = 0;;
	
	for (addr = 0; addr < PHYSTOP; addr += 4096) {
		i0 = (addr >> 22) & 1023;
		i1 = (addr >> 12) & 1023;
		
		if ((tbl0[i0 + 512] & 1) != 0)
			tbl1 = (tbl0[i0 + 512] & ~4095) | 0x80000000;
		else {
			if ((tbl1 = kalloc()) == 0)
				goto bad;
			tbl0[i0 + 512] = (tbl1 & 0x7FFFFFFF) | 3;
		}
		tbl1[i1] = addr | 3;
	}
	
	for (addr = 0xfe000000; addr != 0; addr += 4096) {
		i0 = (addr >> 22) & 1023;
		i1 = (addr >> 10) & 1023;
		
		if ((tbl0[i0] & 1) != 0)
			tbl1 = (tbl0[i0] & ~4095) & 0x80000000;
		else {
			if ((tbl1 = kalloc()) == 0)
				goto bad;
			tbl0[i0] = (tbl1 & 0x7FFFFFFF) | 3;
		}
		tbl1[i1] = (addr & 0x7FFFFFFF) | 3;
	}

	return (tbl0);
	
bad:
	for (i0 = 512; i0 < 1024 ; i0++)
		if (tbl0[i0] != 0)
			kfree((tbl0[i) & ~4095) | 0x80000000);

	kfree(tbl0);
	return (NULL);
}