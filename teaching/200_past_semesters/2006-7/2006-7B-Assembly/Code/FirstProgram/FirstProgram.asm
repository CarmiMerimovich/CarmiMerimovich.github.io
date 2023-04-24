         TITLE First program

         .386
         .model flat

         extern _ExitProcess@4:Near
         .code                 ;Code area
_main:
        push    0                       ;Black box. Always terminate
        call    _ExitProcess@4          ;program with this sequence

        end   _main       ;end of program. Label is the entry point.

