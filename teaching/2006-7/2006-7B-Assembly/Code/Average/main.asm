         TITLE	Main (Average program)

         .386
         .model flat

        .data

Stud1   BYTE    'Rega      '
        BYTE    100,90,80

Stud2   BYTE    'Dodly     '
        BYTE    90,90,90

Stud3   BYTE    'Havitush  '
        BYTE    80,90,100

Stud4   BYTE    'Fistuk    '
        BYTE    70,100,100

        INCLUDE rec.inc

VecSize=50
Vector  BYTE    VecSize Dup (AvgRecSize Dup(?))

        extern  _ExitProcess@4:NEAR, InsertToAvgVec: NEAR

        .code
_main:
        sub     esp,(GrdRecSize + 3) and not 3 ;Make place for GrdRec
        mov     edi,esp
        mov     esi,OFFSET Stud4
        mov     ecx,GrdRecSize
copy1:  mov     al,[esi]        ;copy Stud4 record
        mov     [edi],al
        inc     esi
        inc     edi
        loop    copy1
        push    3
        push    OFFSET Vector
        Call    InsertToAvgVec  ;Insert to place 3 in average vector

        sub     esp,(GrdRecSize + 3) and not 3 ;Make place for GrdRec
        mov     edi,esp         ;
        mov     esi,OFFSET Stud1
        mov     ecx,GrdRecSize
copy2:  movsb
        loop    copy2
        push    2
        push    OFFSET Vector
        Call    InsertToAvgVec  ;Insert to place 2 in average vector

        sub     esp,(GrdRecSize + 3) and not 3 ;Make place for GrdRec
        mov     edi,esp         ;
        mov     esi,OFFSET Stud3
        mov     ecx,GrdRecSize
        rep     movsb
        push    1
        push    OFFSET Vector
        Call    InsertToAvgVec  ;Insert to place 1 in average vector

        sub     esp,(GrdRecSize + 3) and not 3 ;Make place for GrdRec
        mov     edi,esp         ;
        mov     esi,OFFSET Stud2
        mov     ecx,GrdRecSize
        rep     movsb
        push    0
        push    OFFSET Vector
        Call    InsertToAvgVec  ;Insert to place 0 in average vector

        push    0
        call    _ExitProcess@4
        

        end     _main
