         TITLE	Str102D Convert Null-terminated string to DWORD.

         .386
         .model flat

		extern	_ExitProcess@4:Near

        .data
Result  DWORD   ?
String  BYTE    '12345678900',0

        .code
_main:
        push    OFFSET Result ;Address of result
        push    OFFSET String ;Address of input string
        call    Str102D       ;Call the conversion procedure

		call	_ExitProcess@4
;
; Str102D(char *StrPtr, unsigned int *d)
; Input parameters:
;               StrPtr   Points to input string
; Output parameters:
;               d        Point to longowrd result
;
; Return Value: EAX is 0 if conversion succeeded. Otherwise it is 1.
str102D:
StrPtr = 8
D      = StrPtr+4
Ten    = -4
        push    ebp             ;Standard prologue
        mov     ebp,esp

        push    10              ;Constant for Multiplty

        push    edx             ;Saving registers we use
        push    esi
        push    ebx

        mov     ebx,0           ;We handle only bl, then add ebx...
        mov     edx,ebx         ;Clear for MUL
        mov     eax,ebx         ;The number will be summed here

        mov     esi, StrPtr[ebp];Input string
NextDigit:
        mov     bl,[esi]        ;Fetch digit
        inc     esi             ;Point to next digit
        cmp     bl,0            ;Null?
        je      GoodDone        ;Yes, we are done.

        cmp     bl,'0'          ;No. Check for legal digit
        jl      BadInput
        cmp     bl,'9'
        jg      BadInput
                                ;Digit OK.
        sub     bl,'0'          ;Convert ASCII to number

        mul     DWORD PTR Ten[ebp] ;Multiply previous sum by 10
        jc      BadInput        ;Overflow...
        add     eax,ebx         ;and add current digit
        jnc     NextDigit       ;Continue if not overflow.

BadInput:
        mov     eax,1
        jmp     Done

GoodDone:
        mov     esi,D[ebp]      ;Store result
        mov     [esi],eax

        mov     eax,0           ;Success code
Done:
        pop     ebx             ;Restore registers
        pop     esi
        pop     edx

        add     esp,4            ;Also good: mov esp,ebp

        pop     ebp

        ret     8

        end   _main

