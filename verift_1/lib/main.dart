import 'dart:convert';

import 'package:crypto/crypto.dart';
import 'package:flutter/material.dart';
import 'package:flutter_qr_bar_scanner/qr_bar_scanner_camera.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';
import 'package:web3dart/web3dart.dart';
import 'package:web_socket_channel/io.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.grey,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  String abiJson = """[
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "addressToUri",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "eventNameToAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_addr",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_uri",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_eventName",
          "type": "string"
        }
      ],
      "name": "setAddressAndUriForEvent",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_eventName",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "_addr",
          "type": "address"
        }
      ],
      "name": "setAddressForEvent",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_uri",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "_addr",
          "type": "address"
        }
      ],
      "name": "setUriForAddress",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]""";
  late final Web3Client ethClient;
  late final Future<List<dynamic>>? futureOfIpfs;
  late final Future<List<dynamic>>? futureOfWeb3;
  final Client httpClient = Client();
  late TextEditingController _controller;
  final _formKey = GlobalKey<FormState>();

  late String eventName;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();

    final String apiUrl = "https://rinkeby.infura.io/v3/3b40e219c16244cc8d727fff28f50af2";
    final String s = "wss://rinkeby.infura.io/ws/v3/3b40e219c16244cc8d727fff28f50af2";
    ethClient = Web3Client(apiUrl, httpClient, socketConnector: () => IOWebSocketChannel.connect(s).cast<String>());
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<List<dynamic>> getEventNameToAddress(Web3Client ethClient, String eventName) async {
    final contract =
        DeployedContract(ContractAbi.fromJson(abiJson, "EventToAddressStore"), EthereumAddress.fromHex("0xd43aB058d44ae56BEffA005991FFA3E9a6C41B8A"));
    final ethFunction = contract.function("eventNameToAddress");
    final result = await ethClient.call(contract: contract, function: ethFunction, params: [eventName]);
    print(result);
    return result;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          GradientText(
            'VeriFT',
            style: const TextStyle(fontSize: 40, fontWeight: FontWeight.w500, fontStyle: FontStyle.italic),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Colors.blue,
                Colors.red,
              ],
            ),
          ),
          SizedBox(
            height: 30,
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                GradientText(
                  'Enter the name of your event:',
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w300),
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Colors.blue,
                      Colors.red,
                    ],
                  ),
                ),
              ],
            ),
          ),
          Center(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(15),
              child: Form(
                key: _formKey,
                child: Column(
                  children: <Widget>[
                    TextFormField(
                      controller: _controller,

                      // The validator receives the text that the user has entered.
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter some text';
                        }
                        return null;
                      },
                    ),
                  ],
                ),
              ),
            ),
          ),
          SizedBox(height: 50),
          Center(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(15),
              child: Stack(
                children: <Widget>[
                  Positioned.fill(
                    child: Container(
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Colors.blue,
                            Colors.red,
                          ],
                        ),
                      ),
                    ),
                  ),
                  ElevatedButton(
                    style: ButtonStyle(
                      fixedSize: MaterialStateProperty.all(Size(MediaQuery.of(context).size.width * 0.8, MediaQuery.of(context).size.width * 0.05)),
                      backgroundColor: MaterialStateProperty.all(Colors.green.withOpacity(0)),
                      shadowColor: MaterialStateProperty.all(Colors.green.withOpacity(0)),
                    ),
                    onPressed: () async {
                      // Validate returns true if the form is valid, or false otherwise.
                      if (_formKey.currentState!.validate()) {
                        List<dynamic> list = await getEventNameToAddress(ethClient, _controller.text);
                        String address = list[0].toString();
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => ScanQRCodePage(address: address)),
                        );
                      }
                    },
                    child: const Text('Submit', style: TextStyle(color: Colors.white, fontSize: 24)),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class ScanQRCodePage extends StatefulWidget {
  final String address;
  ScanQRCodePage({Key? key, required this.address}) : super(key: key);

  @override
  _ScanQRCodePageState createState() => _ScanQRCodePageState();
}

class _ScanQRCodePageState extends State<ScanQRCodePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          GradientText(
            'VeriFT',
            style: const TextStyle(fontSize: 40, fontWeight: FontWeight.w500, fontStyle: FontStyle.italic),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Colors.blue,
                Colors.red,
              ],
            ),
          ),
          SizedBox(
            height: 30,
          ),
          Center(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(15),
              child: Stack(
                children: <Widget>[
                  Positioned.fill(
                    child: Container(
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Colors.blue,
                            Colors.red,
                          ],
                        ),
                      ),
                    ),
                  ),
                  TextButton(
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.all(16.0),
                      primary: Colors.white,
                      textStyle: const TextStyle(fontSize: 20),
                      fixedSize: Size(MediaQuery.of(context).size.width * 0.8, MediaQuery.of(context).size.width * 0.16),
                    ),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => QRCodePage(address: widget.address)),
                      );
                    },
                    child: const Text('Scan QR Code', style: TextStyle(color: Colors.white, fontSize: 24)),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class GradientText extends StatelessWidget {
  const GradientText(
    this.text, {
    required this.gradient,
    this.style,
  });

  final String text;
  final TextStyle? style;
  final Gradient gradient;

  @override
  Widget build(BuildContext context) {
    return ShaderMask(
      blendMode: BlendMode.srcIn,
      shaderCallback: (bounds) => gradient.createShader(
        Rect.fromLTWH(0, 0, bounds.width, bounds.height),
      ),
      child: Text(text, style: style),
    );
  }
}
//
// class VerificationPage extends StatefulWidget {
//   Image image;
//   String hash;
//   VerificationPage({Key? key, required this.image, required this.hash}) : super(key: key);
//
//   @override
//   _VerificationPageState createState() => _VerificationPageState();
// }
//
// class _VerificationPageState extends State<VerificationPage> {
//   late final Future<String>? fut;
//   late final Future<EtherAmount>? fut2;
//
//   final String apiUrl = "https://mainnet.infura.io/v3/3b40e219c16244cc8d727fff28f50af2"; //Replace with your API
//
//   final Client httpClient = Client();
//
//   Future<String> getResp() async {
//     Response resp = await http.get(
//       Uri.parse('https://gateway.pinata.cloud/ipfs/QmPCeGC3vcBavqXRBTT8DH8oavEBKFSBSsj265GAgAuL7a'),
//     );
//     print(sha256.convert(resp.bodyBytes).toString());
//     return sha256.convert(resp.bodyBytes).toString();
//   }
//
//   Future<EtherAmount> getResp2() async {
//     final Web3Client ethClient = Web3Client(apiUrl, httpClient);
//     return ethClient.getGasPrice();
//   }
//
//   @override
//   void initState() {
//     super.initState();
//
//     // Assign that variable your Future.
//     fut = getResp();
//     fut2 = getResp2();
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//         appBar: AppBar(
//           backgroundColor: Colors.white,
//           elevation: 0,
//         ),
//         body: Container(
//           color: Colors.white,
//           child: FutureBuilder<String>(
//               future: fut,
//               builder: (context, snapshot) {
//                 return Column(mainAxisAlignment: MainAxisAlignment.center, crossAxisAlignment: CrossAxisAlignment.center, children: [
//                   FutureBuilder<EtherAmount>(
//                       future: fut2,
//                       builder: (context, snapshot) {
//                         if (snapshot.hasData) {
//                           return Text(snapshot.data!.toString());
//                         } else {
//                           return Text("Couldn't fetch, retry");
//                         }
//                       }),
//                   widget.image,
//                   SizedBox(
//                     height: 10,
//                   ),
//                   snapshot.hasData
//                       ? widget.hash == snapshot.data
//                           ? Row(
//                               mainAxisAlignment: MainAxisAlignment.center,
//                               children: [
//                                 Icon(
//                                   Icons.verified_outlined,
//                                   size: MediaQuery.of(context).size.height * 0.1,
//                                   color: Colors.green,
//                                 ),
//                                 Text("Verified!", style: TextStyle(fontSize: 36))
//                               ],
//                             )
//                           : Row(
//                               mainAxisAlignment: MainAxisAlignment.center,
//                               children: [
//                                 Icon(
//                                   Icons.close_outlined,
//                                   size: MediaQuery.of(context).size.height * 0.1,
//                                   color: Colors.red,
//                                 ),
//                                 Text("Not Verified!", style: TextStyle(fontSize: 36))
//                               ],
//                             )
//                       : Row(
//                           mainAxisAlignment: MainAxisAlignment.center,
//                           children: [
//                             Icon(
//                               Icons.hourglass_empty_outlined,
//                               size: MediaQuery.of(context).size.height * 0.1,
//                               color: Colors.black,
//                             ),
//                             Text("Loading...", style: TextStyle(fontSize: 36))
//                           ],
//                         )
//                 ]);
//               }),
//         ));
//   }
// }

class QRCodePage extends StatefulWidget {
  final String address;
  const QRCodePage({Key? key, required this.address}) : super(key: key);

  @override
  _QRCodePageState createState() => _QRCodePageState();
}

class _QRCodePageState extends State<QRCodePage> {
  late final Web3Client ethClient;
  final String abiJson2 = """[
	{
		"inputs": [],
		"name": "decrementUint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalanceOfAddress",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "incrementUint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "myAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "myBool",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "myString",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "myUint",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "myUint8",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "setAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "_myBool",
				"type": "bool"
			}
		],
		"name": "setMyBool",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_myUint",
				"type": "uint256"
			}
		],
		"name": "setMyUint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]""";
  final String abiJson = """[
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_NFTToHold",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_maxTicketNumber",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_eventName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_eventSymbol",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_tokenURI",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "NFTToHold",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "hashes",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "hashesForNFT",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxTicketNumber",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_hash",
          "type": "string"
        }
      ],
      "name": "mintTicket",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "mintedFromIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "price",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ticketNFTContract",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]""";
  late final Future<List<dynamic>>? futureOfIpfs;
  late final Future<List<dynamic>>? futureOfWeb3;

  final Client httpClient = Client();
  String calculatedHash = "";
  late final Future<String> image_hash_ipfs;
  late final Map<String, dynamic> data;
  final qrKey = GlobalKey(debugLabel: "QR");

  // Future<List<dynamic>> fetchWeb3Hash(String calculatedHash) async {
  //   final Web3Client ethClient = Web3Client(apiUrl, httpClient);
  //   List<dynamic> l = await ethClient.call(
  //       contract: DeployedContract(ContractAbi.fromJson(abiJson, "Event"), EthereumAddress.fromHex("0x1921a0CA21FC78FD988c767FCF93D7C54Acc6910")),
  //       function: ContractFunction("owner", [
  //         // FunctionParameter<String>("", StringType())
  //       ]),
  //       params: [
  //         // calculatedHash
  //       ]);
  //
  //   return l;
  // }

  Future<List<dynamic>> calculateHash(Web3Client ethClient, String url) async {
    http.Response response = await http.get(
      Uri.parse(url),
    );
    Digest digest = sha256.convert(response.bodyBytes);
    print(digest.toString());
    final contract = DeployedContract(ContractAbi.fromJson(abiJson, "Event"), EthereumAddress.fromHex(widget.address));
    final ethFunction = contract.function("hashes");
    final result = await ethClient.call(contract: contract, function: ethFunction, params: ["0x" + digest.toString()]);
    print(result);
    return [digest.toString(), result];
  }

  String? _qrInfo = 'Scan a QR/Bar code';
  bool camState = false;

  qrCallback(String? code) {
    setState(() {
      camState = false;
      _qrInfo = code;
      data = json.decode(code!);
      futureOfIpfs = calculateHash(ethClient, data["ipfsPath"]);
    });
  }

  @override
  void initState() {
    super.initState();
    final String apiUrl = "https://rinkeby.infura.io/v3/3b40e219c16244cc8d727fff28f50af2";
    final String s = "wss://rinkeby.infura.io/ws/v3/3b40e219c16244cc8d727fff28f50af2";
    ethClient = Web3Client(apiUrl, httpClient, socketConnector: () => IOWebSocketChannel.connect(s).cast<String>());

    setState(() {
      camState = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        floatingActionButton: FloatingActionButton(
          onPressed: () {
            if (camState == true) {
              setState(() {
                camState = false;
              });
            } else {
              setState(() {
                camState = true;
              });
            }
          },
          child: Icon(Icons.camera),
        ),
        body: camState
            ? Center(
                child: SizedBox(
                  height: 1000,
                  width: 500,
                  child: QRBarScannerCamera(
                    onError: (context, error) => Text(
                      error.toString(),
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.red),
                    ),
                    qrCodeCallback: (code) {
                      qrCallback(code);
                    },
                  ),
                ),
              )
            : Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  GradientText(
                    'VeriFT',
                    style: const TextStyle(fontSize: 40, fontWeight: FontWeight.w500, fontStyle: FontStyle.italic),
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Colors.blue,
                        Colors.red,
                      ],
                    ),
                  ),
                  Column(mainAxisAlignment: MainAxisAlignment.center, crossAxisAlignment: CrossAxisAlignment.center, children: [
                    Image.network(
                      data["ipfsPath"],
                      fit: BoxFit.cover,
                    ),
                    SizedBox(height: 30),
                    FutureBuilder<List<dynamic>>(
                        future: futureOfIpfs,
                        builder: (context, snapshot) {
                          if (snapshot.hasData) {
                            // String ipfs_data = snapshot.data![0];
                            print("snap: " + snapshot.data![1][0].toString());
                            if (snapshot.data![1][0].toString().toLowerCase() == "true") {
                              return Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.verified_outlined,
                                    size: MediaQuery.of(context).size.height * 0.1,
                                    color: Colors.green,
                                  ),
                                  Text("Verified", style: const TextStyle(fontSize: 40, fontWeight: FontWeight.w500, fontStyle: FontStyle.italic))
                                ],
                              );
                            } else {
                              return Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.close_outlined,
                                    size: MediaQuery.of(context).size.height * 0.1,
                                    color: Colors.red,
                                  ),
                                  Text("Not Verified", style: const TextStyle(fontSize: 40, fontWeight: FontWeight.w500, fontStyle: FontStyle.italic))
                                ],
                              );
                            }
                          } else {
                            return Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.hourglass_empty_outlined,
                                  size: MediaQuery.of(context).size.height * 0.1,
                                  color: Colors.red,
                                ),
                                Text("Loading...", style: const TextStyle(fontSize: 40, fontWeight: FontWeight.w500, fontStyle: FontStyle.italic))
                              ],
                            );
                          }
                        })
                  ]),
                ],
              ));
  }
}
