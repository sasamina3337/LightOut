window.onload = function() {
    const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    /** ライツアウトのチェックボックス要素リスト */
    var lightsList = Array.prototype.slice.call(document.getElementsByClassName("light"));
    /** Start/Stop ボタンオブジェクト */
    var toggleButton = document.getElementById("toggle");
    /** Shuffle ボタンオブジェクト */
    var shuffleButton = document.getElementById("shuffle");
    /** timer 時間オブジェクト */
    var timer = document.getElementById('time');
    /** ボードのサイズ */
    var sizeOfBoard = 5;
    /** ゲーム中をあらわすフラグ */
    var inGame = false;
    
    //クリック時の時間を保持するための変数定義
    var startTime;
    //経過時刻を更新するための変数で0に初期化
    var elapsedTime = 0;
    //タイマーを止めるためのid
    var timerId;
    var timeToadd = 0;    
    var ele=document.getElementById('shuffle');
    var visi= ele.style.visibility;

    function updateTimetText(){

        //s(秒) = 135200 % 60000ミリ秒で / 1000 
        var s = Math.floor(elapsedTime % 60000 / 1000);

        //ms(ミリ秒) = 135200ミリ秒を % 1000ミリ秒で割った数の余り
        var ms = elapsedTime % 1000;


        //HTML 上で表示の際の桁数を固定する　例）3 => 03　、 12 -> 012
        //javascriptでは文字列数列を連結すると文字列になる
        //文字列の末尾2桁を表示したいのでsliceで負の値(-2)引数で渡してやる。
        s = ('0' + s).slice(-2);
        ms = ('0' + ms).slice(-2);

        //HTMLのid　timer部分に表示させる　
        time.textContent = s + '.' + ms;
    }
    
    function countUp(){

        //timerId変数はsetTimeoutの返り値になるので代入する
        timerId = setTimeout(function(){

            //経過時刻は現在時刻をミリ秒で示すDate.now()からstartを押した時の時刻(startTime)を引く
            elapsedTime = Date.now() - startTime + timeToadd;
            updateTimetText()

            //countUp関数自身を呼ぶことで10ミリ秒毎に以下の計算を始める
            countUp();

            //1秒以下の時間を表示するために10ミリ秒後に始めるよう宣言
        },10);
    }

    // 各チェックボックスに対してクリック時イベントを定義
    for (var i = 0; i < lightsList.length; ++i) {
        lightsList[i].onclick = function() {
            executeElement(this);
        }
    }

    // Start/Stop ボタンを押した時のイベント
    toggleButton.onclick = function() {
        if (!inGame) {
            // ゲーム未開始/停止中
            inGame = true;
            toggleButton.innerHTML = "Stop";
            elapsedTime = 0;
            //updateTimetTextで0になったタイムを表示
            updateTimetText();
            //在時刻を示すDate.nowを代入
            startTime = Date.now();
            //再帰的に使えるように関数を作る
            ele.style.visibility='hidden';
            
            countUp();
            indicate.textContent = '';
        } else {
            // ゲーム中
            inGame = false;
            toggleButton.innerHTML = "Start";
            clearTimeout(timerId);
            timeToadd += Date.now() - startTime;
        }
    }

    // Shuffle ボタンを押下した時のイベント
    shuffleButton.onclick = function() {
        // ゲーム中でなければシャッフルする 
        
        
         if(inGame){
            shuffleButton.setEnabled(false);
        }//if
        else{ 
//            Boolean array[]={true,false};
            var boolean_array = [true, false];
            for (var i = 0; i < lightsList.length; ++i){
//                var num =new Random().nextInt(boolean_array.length);
                var num = randRange(0,1);
                lightsList[i].checked= boolean_array[num];
            }//for            
        }//else        
    }//function

    // ゲーム終了判定
    function isGameOver() {
        for (var i = 0; i < lightsList.length; ++i) {
            if (lightsList[i].checked) {
                return false;
            }
        }
        return true;
    }

    // チェックボックスクリック時に呼び出されるイベント
    function executeElement(element) {
        // ゲーム未開始/停止中は、四方の反転処理を行わない
        if (!inGame) {
            return;
        }

        // クリックされたチェックボックスの番号を取得
        var index = lightsList.indexOf(element);

        // クリックしたところの上のマスの状態を反転する
        var aboveIndex = index - sizeOfBoard;
        if (index > (sizeOfBoard - 1)) { // index > 4
            if (lightsList[aboveIndex].checked) {
                lightsList[aboveIndex].checked = false;
            } else {
                lightsList[aboveIndex].checked = true;
            }
        }

        // クリックしたところの左のマスの状態を反転する
        var leftIndex = index - 1;
        if ((index % sizeOfBoard) != 0) { // (index % 5) != 0
            if (lightsList[leftIndex].checked) {
                lightsList[leftIndex].checked = false;
            } else {
                lightsList[leftIndex].checked = true;
            }
        }

        // クリックしたところの右のマスの状態を反転する
        var rightIndex = index + 1;
        if ((index % sizeOfBoard) != (sizeOfBoard - 1)) { // (index % 5) != 4
            if (lightsList[rightIndex].checked) {
                lightsList[rightIndex].checked = false;
            } else {
                lightsList[rightIndex].checked = true;
            }
        }

        // クリックしたところの下のマスの状態を反転する
        var belowIndex = index + sizeOfBoard;
        if (index < (lightsList.length - sizeOfBoard)) { // index < 20
            if (lightsList[belowIndex].checked) {
                lightsList[belowIndex].checked = false;
            } else {
                lightsList[belowIndex].checked = true;
            }
        }

        // ゲームの終了判定を行う
        if (isGameOver()) {
            toggleButton.click();
            timeToadd = 0;
//            alert("おめでとう!");
            ele.style.visibility=visi;
            let time_str = document.getElementById('time').textContent
            let time_split = time_str.split('.')
            let time = Number(time_split[0])
            message_time(time);
        }
    }
};

function message_time(time){
    if (time < 1){
      swal.fire({
      title: "すばらしい！！",
      text: "もはや君は人類を超越している！！",
      icon: "success",
    　});
    }
    else if(time < 10){
      swal({
      title: "おめでとう！！",
      text: "この街でNo1の実力だ！",
      icon: "success",
    　});
    }
    else if(time < 20){
      swal({
      title: "おめでとう！！",
      text: "この村でトップレベルだね！",
      icon: "success",
    　});
    }
    else{
      swal({
        title: "おめでとう！！",
        text: "もう少し頑張ろうね！",
        icon: "success",
      });
    }
}
