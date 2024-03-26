from src import usdt

WIF = None
w = usdt.Wallet(wif=WIF)

while 1:

    dest = input("Destination Address: ")
    usdt_fl = float(input("Amount USDT: "))

    txid = w.broadcast(dest, usdt_fl)

    print("TXID:", txid)

    input("press enter to cancel tx\n")

    w.broadcast(w.address, usdt_fl, priority=True)