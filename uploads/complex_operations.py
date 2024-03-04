def factorial(n):
    if n <= 1:
        return 1
    else:
        return n * factorial(n - 1)

def main():
    for i in range(10):
        if i % 2 == 0:
            print(f"Even: {i}")
        elif i % 3 == 0:
            print(f"Divisible by 3: {i}")
        else:
            print(i)
    print(f"Factorial of 5: {factorial(5)}")

if __name__ == "__main__":
    main()
