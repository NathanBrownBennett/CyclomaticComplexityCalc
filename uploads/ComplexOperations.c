#include <stdio.h>

int factorial(int n) {
    if (n <= 1) return 1;
    else return n * factorial(n - 1);
}

int main() {
    int i;
    for (i = 0; i < 10; i++) {
        if (i % 2 == 0) printf("Even: %d\n", i);
        else if (i % 3 == 0) printf("Divisible by 3: %d\n", i);
        else printf("%d\n", i);
    }
    printf("Factorial of 5: %d\n", factorial(5));
    return 0;
}
