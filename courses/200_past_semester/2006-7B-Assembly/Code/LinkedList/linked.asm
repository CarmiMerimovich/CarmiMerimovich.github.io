         TITLE Linked list example

         .386
         .model flat

		extern	_ExitProcess@4:Near

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
        push    OFFSET linked
	call	Insert

        push    OFFSET Linked
        call    Min

		call	_ExitProcess@4
;
; Insert(HeadPtr, After, Item)
; Input parameters:
;               HeadPtr   Pointer to head (which points to first element)
;               After     Pointer to item before which we insert
;               Item      Pointer to item to insert
;
Insert:
HeadPtr  = 8
After    = HeadPtr+4
Item     = After+4
        push    ebp             ;Standard prologue
        mov     ebp,esp

        push    esi
        push    edi

        mov     esi,After[ebp]  ;After which element
        mov     edi,Item[ebp]   ;New element

        cmp     esi,0           ;To add as first?
        jne     Normal          ;No, usual handling
        
        mov     esi,HeadPtr[ebp];Yes, add 'after' the header
Normal:
        mov     eax,[esi]      
        mov     [edi],eax
        
        mov     [esi],edi
done3:
        pop     edi
        pop     esi

        pop     ebp

        ret     12
;
; Min(ptr)
; Input parameters:
;               ptr   Pointer to head (which points to first element)
;
Min:
HeadPtr = 8
        push    ebp             ;Standard prologue
        mov     ebp,esp

        push    esi
        push    ecx
        push    ebx

        mov     ebx,0           ;Points to minimal string
        mov     esi,HeadPtr[ebp]
        mov     esi,[esi]
        cmp     esi,0
        je      EmptyList

        mov     ebx,esi
        add     ebx,4           ;Set the first to be Minimal!
NextElement:
        mov     esi,[esi]       ;Next element
        cmp     esi,0           ;End of list?
        je      Done            ;Get out.
        mov     ecx,esi         ;Not the end. Need to check for minimality
        add     ecx,4
        push    ecx             ;Current string
        push    ebx             ;Current minimal string
        call    StrCmp          ;Compare strings
        cmp     eax,0
        jl      NextElement     ;Current minimal is not greater the current
        mov     ebx,ecx         ;Current minimal is greater than current.
        jmp     NextElement     ;
Done:
        sub     ebx,4
Emptylist:
        mov     eax,ebx         ;Element with minimal string is returned

        pop     ebx
        pop     ecx
        pop     esi

        pop     ebp
        ret     4

;
; int StrCmp(str1,str2)
; Input parameters:
;               str1    Pointer to null terminated string
;               str2    Pointer to null terminated string
; Return value:
;       eax = -1        if str1 < str2
;       eax =  0        if str1 == str2
;       eax =  1        if str1 > str2
StrCmp:
str1=8
str2=str1 + 4
        push    ebp             ;Standard prologue
        mov     ebp,esp

        push    esi
        push    edx
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
        jmp     done2
Different:
        jg      Greater
        mov     eax,-1          ;str1 < str2 is signaled with eax=-1
        jmp     done2
Greater:
        mov     eax,1           ;str1 > str2 is signaled with eax=1
done2:
        pop     ebx
        pop     edx
        pop     esi

        pop     ebp

        ret     8

        end   _main

