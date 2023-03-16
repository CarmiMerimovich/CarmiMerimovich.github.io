// SharedMemory.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"

#define BUF_SIZE 256

void _tmain(int argc, _TCHAR* argv[])
{

   HANDLE hMapFile;
   LPCTSTR pBuf;
   char *szName = "SharedMem";

   hMapFile = CreateFileMapping(
                 INVALID_HANDLE_VALUE,    // use paging file
                 NULL,                    // default security 
                 PAGE_READWRITE,          // read/write access
                 0,                       // max. object size 
                 BUF_SIZE,                // buffer size  
                 szName);                 // name of mapping object
 
   if (hMapFile == NULL || hMapFile == INVALID_HANDLE_VALUE) 
   { 
      printf("Could not create file mapping object (%d).\n", 
             GetLastError());
      return;
   }

   pBuf = (LPTSTR) MapViewOfFile(hMapFile,   // handle to map object
                        FILE_MAP_ALL_ACCESS, // read/write permission
                        0,                   
                        0,                   
                        BUF_SIZE);           
 
   if (pBuf == NULL) 
   { 
      printf("Could not map view of file (%d).\n", 
             GetLastError()); 
      return;
   }


   return;
}

