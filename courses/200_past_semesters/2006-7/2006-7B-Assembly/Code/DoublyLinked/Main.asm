         TITLE Main (Multi Module Program)

         .386
         .model flat


        EXTERN  _ExitProcess@4:NEAR

        .data
DoublyLinked \                  ;Continuation line
        DWORD   Rabecca
        DWORD   Jacob

Rabecca DWORD   Abraham
        DWORD   0
        BYTE    'Rabecca',0

Abraham DWORD   Jacob
        DWORD   Rabecca
        BYTE    'Abraham',0

Jacob   DWORD   0
        DWORD   Abraham
        BYTE    'Jacob',0

Itzhak  DWORD   ?
        DWORD   ?
        BYTE    'Itzhak',0

Sarah   DWORD   ?
        DWORD   ?
        BYTE    'Sarah',0

Leah    DWORD   ?
        DWORD   ?
        BYTE    'Leah',0


        EXTERN   Remove:Near

        .code
_main:
        push    Offset Jacob
        push    OFFSET DoublyLinked
        call    Remove

        push    0
        call    _ExitProcess@4

        end   _main

