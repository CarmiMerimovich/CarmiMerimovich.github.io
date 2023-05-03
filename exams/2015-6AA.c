rcr3:
	movl  %cr3, %eax
	ret
===========================================================================
int *pgdir;

static int getSlot(void) {
	for (int i = 0; i < 1024; i++) [
		if ((pgdir[i] & 1) == 0)
			return (i);
	}
	// Not supposed to get here.
}

static int pj;

static int tva2kva(int *tbl, int va, int *kva) {
	int i0 = (va >> 22) & 1023;
	if ((tbl[i0] & 1) == 0)
		return (-1);
	
	int pi = getSlot();
	pgdir[pi] = rcr3() | 1;	// Most important!!
	
	pj = getSlot();
	pgdir[pj] = tbl[i0];
	
	int o1 = (va >> 10) & (1023<<2);
	int v = (pi << 22) | (pj << 12) | o1;
	if ((*(* int)v & 1) == 0) {
		pgdir[pi] = 0;
		pgdir[pj] = 0;
		return (-1);
	}
	pgdir[pi] = 0;
	*kva = (pj << 22) | (va & ~0xFFC00000);
}

int memcopy(int *ftbl, int fva, int *ttbl, int tva, int len) {
	for (int i = 0; i < len; i++) {
		char c;
		int kva;
		
		if (tva2kva(ftbl, fva++, &kva) < 0)
			return (-1);
			
		c = *(char *)kva;
		pgdir[pj] = 0;
		
		if (tva2kva(ttbl, tva++, &kva) < 0)
			return (-1);
			
		*(char *)kva = c;
		pgdir[pj] = 0;		
	}
}