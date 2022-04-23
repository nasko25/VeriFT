import 'package:crypto/crypto.dart';
import 'package:flutter/material.dart';
import 'package:flutter_qr_bar_scanner/qr_bar_scanner_camera.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or simply save your changes to "hot reload" in a Flutter IDE).
        // Notice that the counter didn't reset back to zero; the application
        // is not restarted.
        primarySwatch: Colors.grey,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
          child: TextButton(
        style: ButtonStyle(
          fixedSize: MaterialStateProperty.all(Size(MediaQuery.of(context).size.width * 0.8, MediaQuery.of(context).size.width * 0.13)),
          shape: MaterialStateProperty.all<RoundedRectangleBorder>(
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(13.0), side: BorderSide(color: Colors.black))),
          backgroundColor: MaterialStateProperty.all<Color>(Colors.black),
        ),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => VerificationPage(
                      image: Image.network('https://gateway.pinata.cloud/ipfs/QmSg4Na3EHYrxv3BPpUNwaUm8weiFP37ryY18k7RG5QKSF'),
                      hash: '5cab4f44cbb679d36b84801be15b90dd9df68a6ce1cf681ef85566b6bb7cf073',
                    )),
          );
        },
        child: Text('Scan QR Code', style: TextStyle(color: Colors.white, fontSize: 24)),
      )),
    );
  }
}

class VerificationPage extends StatefulWidget {
  Image image;
  String hash;
  VerificationPage({Key? key, required this.image, required this.hash}) : super(key: key);

  @override
  _VerificationPageState createState() => _VerificationPageState();
}

class _VerificationPageState extends State<VerificationPage> {
  late final Future<String>? fut;

  Future<String> getResp() async {
    Response resp = await http.get(
      Uri.parse('https://gateway.pinata.cloud/ipfs/QmSg4Na3EHYrxv3BPpUNwaUm8weiFP37ryY18k7RG5QKSF'),
    );
    return sha256.convert(resp.bodyBytes).toString();
  }

  @override
  void initState() {
    super.initState();

    // Assign that variable your Future.
    fut = getResp();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 0,
        ),
        body: Container(
          color: Colors.white,
          child: FutureBuilder<String>(
              future: fut,
              builder: (context, snapshot) {
                return Column(mainAxisAlignment: MainAxisAlignment.center, crossAxisAlignment: CrossAxisAlignment.center, children: [
                  widget.image,
                  SizedBox(
                    height: 10,
                  ),
                  snapshot.hasData
                      ? widget.hash == snapshot.data
                          ? Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.verified_outlined,
                                  size: MediaQuery.of(context).size.height * 0.1,
                                  color: Colors.green,
                                ),
                                Text("Verified!", style: TextStyle(fontSize: 36))
                              ],
                            )
                          : Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.close_outlined,
                                  size: MediaQuery.of(context).size.height * 0.1,
                                  color: Colors.red,
                                ),
                                Text("Not Verified!", style: TextStyle(fontSize: 36))
                              ],
                            )
                      : Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.hourglass_empty_outlined,
                              size: MediaQuery.of(context).size.height * 0.1,
                              color: Colors.black,
                            ),
                            Text("Loading...", style: TextStyle(fontSize: 36))
                          ],
                        )
                ]);
              }),
        ));
  }
}

class QRCodePage extends StatefulWidget {
  const QRCodePage({Key? key}) : super(key: key);

  @override
  _QRCodePageState createState() => _QRCodePageState();
}

class _QRCodePageState extends State<QRCodePage> {
  String hash = '5cab4f44cbb679d36b84801be15b90dd9df68a6ce1cf681ef85566b6bb7cf073';
  String hashStr = "";
  final qrKey = GlobalKey(debugLabel: "QR");
  Future<String> checkQRCode(url) async {
    http.Response response = await http.get(
      Uri.parse('https://gateway.pinata.cloud/ipfs/QmSg4Na3EHYrxv3BPpUNwaUm8weiFP37ryY18k7RG5QKSF'),
    );

    Digest digest = sha256.convert(response.bodyBytes);
    setState(() {
      hashStr = digest.toString();
    });
    return digest.toString();
  }

  String? _qrInfo = 'Scan a QR/Bar code';
  bool camState = false;

  qrCallback(String? code) {
    setState(() {
      camState = false;
      _qrInfo = code;
    });
  }

  @override
  void initState() {
    super.initState();
    setState(() {
      camState = true;
    });
  }

  Future<String> getResp() async {
    Response resp = await http.get(
      Uri.parse('https://gateway.pinata.cloud/ipfs/QmSg4Na3EHYrxv3BPpUNwaUm8weiFP37ryY18k7RG5QKSF'),
    );
    return sha256.convert(resp.bodyBytes).toString();
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
            : Column(mainAxisAlignment: MainAxisAlignment.center, crossAxisAlignment: CrossAxisAlignment.center, children: [
                Image.network(_qrInfo!),
                SizedBox(
                  height: 10,
                ),
                FutureBuilder<String>(
                    future: getResp(),
                    builder: (context, snapshot) {
                      if (snapshot.hasData) {
                        if (hash == snapshot.data) {
                          return Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.verified_outlined,
                                size: MediaQuery.of(context).size.height * 0.1,
                                color: Colors.green,
                              ),
                              Text("Verified!", style: TextStyle(fontSize: 36))
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
                              Text("Not Verified!", style: TextStyle(fontSize: 36))
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
                            Text("LOADING", style: TextStyle(fontSize: 36))
                          ],
                        );
                      }
                    })
              ]));
  }

  // FutureBuilder<String>(
  // future: checkQRCode("QmSg4Na3EHYrxv3BPpUNwaUm8weiFP37ryY18k7RG5QKSF"),
  // builder: (context, snapshot) {
  // return Text(
  // '$hashStr',
  // style: Theme.of(context).textTheme.subtitle1,
  // );
  // })
  // @override
  // Widget build(BuildContext context) {
  //   return Scaffold(
  //     body: Column(
  //       mainAxisAlignment: MainAxisAlignment.center,
  //       children: <Widget>[
  //         buildQRView(context),
  //       ],
  //     ),
  //   );
  // }

  // Widget buildQRView(BuildContext context) => QRView(
  //       key: qrKey,
  //       onQRViewCreated: onQRViewCreated,
  //       overlay: QrScannerOverlayShape(
  //           cutOutSize: MediaQuery.of(context).size.width * 0.7, borderWidth: 10, borderLength: 20, borderRadius: 10, borderColor: Colors.lightGreen),
  //     );
  // void onQRViewCreated(QRViewController controller) {
  //   setState(() => this.controller = controller);
  // }
}
