#define VADDR ((int *)0xFF800004)
#define VTBL  ((int *)0xFF801000)

int mmu(int *tbl, unsigned int va, int *ppa) {
   unsiged int i0 = (va >> 22) & 1023;
   int ptbl = tbl[i0];
   if ((ptbl & 1) == 0)
      return (0);
   unsigned int i1 = (va >> 12) & 1023;
   *(VADDR) = ptbl;
   unsigned int pa = VTBL[i1];
   if ((pa & 1) == 0)
      return (0);
   *ppa = (pa & -4096) | (va & 4095);
   return(1);
}