        TITLE   InsertToAvgVec (Average program)
        .386
        .model  flat
        extern  Average:NEAR
        include rec.inc
;
; InsertToAvgVec(Vector, Index, Rec)
; Input parameters:
;               Vector     Pointer to vector of records
;
; Return value: EAX, grade average
;
        .code
InsertToAvgVec  Proc
Vector = 8
Index  = Vector + 4
Rec    = Index  + 4
        push    ebp
        mov     ebp,esp

        push    esi
        push    edi
        push    edx
        push    ecx

        mov     eax,AvgRecSize
        xor     edx,edx
        mul     DWORD PTR Index[ebp]
        add     eax,Vector[ebp] ;point to record in vector

        lea     esi,rec[ebp]    ;rec by value!
        mov     edi,eax
        mov     ecx,GrdRecSize
        rep     movsb           ;Copy record into vector


        sub     esp,(GrdRecSize + 3) and not 3       ;Round to DWORD
        lea     esi,rec[ebp]    ;rec by value!
        mov     edi,esp
        mov     ecx,GrdRecSize
        rep     movsb           ;Copy record to stack

        mov     esi,eax         ;save eax.

        call    Average

        mov     AvgRec_Average[esi],al ;store average into vector record
        
        pop     ecx
        pop     edx
        pop     edi
        pop     esi

        pop     ebp

        ret     8 + (GrdRecSize + 3) and not 3

InsertToAvgVec  endp

        end
