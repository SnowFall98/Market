<?php
    require_once 'vendor/autoload.php'; // You have to require the library from your Composer vendor folder

    MercadoPago\SDK::setAccessToken("TEST-1529378998632258-072301-678c1d145b153dec6f1cd6b12007575a-242250285"); // Either Production or SandBox AccessToken

/*=============================================
Formulario de MercadoPago 
=============================================*/

if(isset($_GET["_x"]) && $_GET["_x"] == md5(base64_decode($_COOKIE["_x"]))){
	
	echo '
	<div style="width:100%; height:100vh; position:fixed; background:url(mp-bg.jpg); background-repeat:no-repeat; background-size:cover">

	<div style="text-align:center; position:absolute; top:45vh; right:120px">

	<form action="http://localhost/market/src/mercadopago/index.php" method="POST">
	  <script
	    src="https://www.mercadopago.com.co/integrations/v1/web-tokenize-checkout.js"
	    data-public-key="TEST-1529378998632258-072301-678c1d145b153dec6f1cd6b12007575a-242250285"
	    data-button-label="Next"
	    data-summary-product-label="'.$_COOKIE["_p"].'"
	    data-transaction-amount="'.base64_decode($_COOKIE["_x"]).'">
	  </script>
	</form>

	</div>

</div>';

}

    $payment = new MercadoPago\Payment();
    
    $payment->transaction_amount = 141;
    $payment->token = "YOUR_CARD_TOKEN";
    $payment->description = "Ergonomic Silk Shirt";
    $payment->installments = 1;
    $payment->payment_method_id = "visa";
    $payment->payer = array(
      "email" => "yordymora98@email.com"
    );

    $payment->save();

    echo $payment->status;
  ?>
