         TITLE Main (Multi Module Program)

         .386
         .model flat

        .data
Linked  DWORD   Rabecca

Rabecca DWORD   Abraham
        BYTE    'Rabecca',0
Abraham DWORD   Jacob
        BYTE    'Abraham',0
Jacob   DWORD   0
        BYTE    'Jacob',0

Itzhak  DWORD   ?
        BYTE    'Itzhak',0

Sarah   DWORD   ?
        BYTE    'Sarah',0

Leah    DWORD   ?
        BYTE    'Leah',0


        EXTERN   Insert:Near, Min:Near,_ExitProcess@4:Near

        .code
_main:
        push    OFFSET Itzhak
        push    0
        push    OFFSET Linked
        call    Insert

        push    OFFSET Sarah
        push    OFFSET Abraham
        push    OFFSET Linked
        call    Insert

        push    OFFSET  Leah
        push    OFFSET Jacob
        push    OFFSET Linked
        call    Insert

        push    OFFSET Linked
        call    Min

		push	0
		call	_ExitProcess@4
		
        end   _main

