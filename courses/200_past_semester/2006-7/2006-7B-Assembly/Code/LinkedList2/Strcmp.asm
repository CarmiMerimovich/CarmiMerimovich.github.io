        Title   StrCmp

        .386
        .model  flat

        public  StrCmp
;
; int StrCmp(str1,str2)
; Input parameters:
;               str1    Pointer to null terminated string
;               str2    Pointer to null terminated string
; Return value:
;       eax = -1        if str1 < str2
;       eax =  0        if str1 == str2
;       eax =  1        if str1 > str2
        .code
StrCmp:
str1=8
str2=str1 + 4
        push    ebp             ;Standard prologue
        mov     ebp,esp

        push    esi
        push    ecx
        push    ebx

        mov     esi,str1[ebp]   ;point to str1
        mov     edi,str2[ebp]   ;point to str2
NextChar:
        mov     al,[esi]        ;Get character from str1
        mov     bl,[edi]        ;Get character from str2
        cmp     al,bl           ;Compare them
        jne     Different       ;If they are not equal, handle return value
        cmp     al,0            ;They're equal. Are they null?
        je      Same            ;Yes. Then strings are equal
        inc     esi             ;No. So we need to check next characters
        inc     edi
        jmp     NextChar
Same:
        mov     eax,0           ;Strings equal are signaled with eax=0
        jmp     done
Different:
        jg      Greater
        mov     eax,-1          ;str1 < str2 is signaled with eax=-1
        jmp     done
Greater:
        mov     eax,1           ;str1 > str2 is signaled with eax=1
done:
        pop     ebx
        pop     ecx
        pop     esi

        pop     ebp

        ret     8

        end

