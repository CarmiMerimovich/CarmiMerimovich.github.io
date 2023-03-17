        TITLE   Average (Average program)
        .386
        .model  flat

        include rec.inc
;
; Average(Rec)
; Input parameters:
;               Rec     Student record (by value)
;
; Return value: EAX, grade average
;
        .data
ConstGradesCount \
        DWORD      GrdRec_GradesCount       ;Need this for DIV

        .code
Average PROC
rec = 8
        push    ebp             ;Standard prologue
        mov     ebp,esp

        push    ebx
        push    ecx
        push    edx
        push    esi

        lea     esi,rec+GrdRec_Grades[ebp] ;ESI point to Grade vector
        mov     ecx,GrdRec_GradesCount
        xor     eax,eax
sum:
        mov     bl,[esi]
        inc     esi
        movzx   ebx,bl
        add     eax,ebx
        loop    sum

        xor     edx,edx
        div     ConstGradesCount
        
        pop     esi
        pop     edx
        pop     ecx

        pop     ebx

        pop     ebp

        ret     (GrdRecSize + 3) and not 3       ;Round to DWORD
Average endp

        end

