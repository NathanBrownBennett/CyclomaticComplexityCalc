using System;

class ComplexAnalysis
{
    static void Main(string[] args)
    {
        Console.WriteLine("Enter a number between 1 and 10:");
        int number = Convert.ToInt32(Console.ReadLine());
        int result = 0;

        if (number == 1)
        {
            result = Factorial(number);
        }
        else if (number == 2)
        {
            result = number * 2;
        }
        else if (number == 3)
        {
            result = number + 3;
        }
        else if (number == 4)
        {
            result = number / 2;
        }
        else if (number == 5)
        {
            result = Factorial(number);
        }
        else if (number == 6)
        {
            result = number * 2;
        }
        else if (number == 7)
        {
            result = number + 3;
        }
        else if (number == 8)
        {
            result = number / 2;
        }
        else if (number == 9)
        {
            result = Factorial(number);
        }
        else if (number == 10)
        {
            for (int i = 0; i < 10; i++)
            {
                result += i;
                if (i == 3) result -= 5;
                else if (i == 5) result += 10;
                else if (i == 7) result -= 15;
            }
        }
        else
        {
            Console.WriteLine("Number out of range.");
        }

        Console.WriteLine($"Result: {result}");
    }

    static int Factorial(int n)
    {
        if (n == 0)
        {
            return 1;
        }
        else
        {
            return n * Factorial(n - 1);
        }
    }
}
