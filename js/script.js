
// まずは、変数・定数を用意する

// 3回戦やる
const maxRound = 3;
// 今が何回戦目か。
// 0からスタートする
let round = 0;
// 最初に持っているチップの枚数は10枚
const startChip = 10;
// 最終的は15枚を超えていると勝ちにする
const goalChip = 15;
// 今持っているチップの枚数
// 最初は10枚である
let chip = startChip;
// 1回戦で賭けるチップの枚数。最初は1枚
// タップで変えられるようにしたい
let bet = 1;
// ゲームが終わったかどうか（終わったらtrueにする）
let GameFinish = false;
// トランプの数字
// 1枚目・2枚目を区別するために1, 2をつけた
let bankerCard1 = 0;
let bankerCard2 = 0;
let playerCard1 = 0;
let playerCard2 = 0;
// 2枚の合計から計算した点数
let bankerPoint = 0;
let playerPoint = 0;
// 「今、プレイヤーのカードをめくってよいか」を表す(Flipがcanかどうか？)
// 最初はカードがないので、めくれない（False）
let canFlip = false;



// チップの場所をタップしたときの処理
$(".bet").on("click", function () {

  // チップの枚数を変更できるターンを限定する（トランプをめくる場面とゲーム終了後はダメ）
  if (canFlip === false && GameFinish === false) {

    // 賭け数を1枚増やす
    bet = bet + 1;

    // 持っているチップより多くは賭けられないので、超えたら1枚に戻すように
    if (bet > chip) {
      bet = 1;
    }
    $(".bet-number").html(bet + "枚");

  }

});


// 「カードを配る」「次のゲームへ」ボタンを押したとき
$(".deal").on("click", function () {

  //canFlipがfalseのときにトランプを配る
  if (canFlip === false) {

  // まだ3回戦が終わっていないときにトランプを配る
  // ifの中にifを入れると「条件1も条件2も両方OKのときだけ」実行される！
  if (round < maxRound) {

    // ゲームを1つ進める（0：最初 → 1 → 2 → 3）
    round = round + 1;

    // jQuery：class="round" のタグの中身を「第〇回戦」という文字に入れ替える
    $(".round").html("第" + round + "回戦");

    // トランプをランダムに決める
    // Math.floor( ) ： 0〜9 の整数に＋1して1~10を再現する
    bankerCard1 = Math.floor(Math.random() * 10) + 1;
    bankerCard2 = Math.floor(Math.random() * 10) + 1;
    playerCard1 = Math.floor(Math.random() * 10) + 1;
    playerCard2 = Math.floor(Math.random() * 10) + 1;

    console.log(round, "回戦 バンカー:", bankerCard1, bankerCard2, "プレイヤー:", playerCard1, playerCard2);

    // バンカーの点数を計算する！
    // まず2枚を足す
    bankerPoint = bankerCard1 + bankerCard2;
    // 合計の「一の位」だけを残すために、10や20を引く！
    // カードは最大10なので、合計は最大 10 + 10 = 20。だから「20を引く」「10を引く」の2パターンを用意している
    if (bankerPoint >= 20) {
      bankerPoint = bankerPoint - 20;
    } else if (bankerPoint >= 10) {
      bankerPoint = bankerPoint - 10;
    }

    $(".banker-cards").html(
      '<img src="img/card' + bankerCard1 + '.png" alt="バンカーのトランプ">' +
      '<img src="img/card' + bankerCard2 + '.png" alt="バンカーのトランプ">'
    );
    $(".banker-point").html("バンカー：" + bankerPoint + "点");

    // プレイヤーのカードは裏向きで配る！
    $(".player-cards").html(
      '<img src="img/back.png" alt="裏向きのカード">' +
      '<img src="img/back.png" alt="裏向きのカード">'
    );
    $(".player-point").html("↑ カードをクリックしてめくろう！");

    $(".result").html("");
    $(".deal").html("カードをめくってね");

    canFlip = true;

  }
  }

});


// プレイヤーのトランプ
$(".player-cards").on("click", function () {

  // トランプをめくれるとき
  if (canFlip === true) {

    canFlip = false;

    // まずは裏面の画像を、表の画像に入れ替える！
    $(".player-cards").html(
      '<img src="img/card' + playerCard1 + '.png" alt="あなたのカード">' +
      '<img src="img/card' + playerCard2 + '.png" alt="あなたのカード">'
    );

    // プレイヤーの点数を計算する
    // バンカーと同じ方法
    playerPoint = playerCard1 + playerCard2;

    if (playerPoint >= 20) {
      playerPoint = playerPoint - 20;
    } else if (playerPoint >= 10) {
      playerPoint = playerPoint - 10;
    }

    $(".player-point").html("プレイヤー：" + playerPoint + "点");

    // チップの増減の分岐
    // バカラに則り「点数が大きいほうが9に近い ＝ 勝ち」とする！

    // プレイヤーの点数のほうが大きい場合
    if (playerPoint > bankerPoint) {

      // 賭けたチップが倍になる
      chip = chip + bet;
      $(".result").html("プレイヤーの勝ち！ +" + bet + "枚");
      $(".result").css("color", "#ff6b7a");

      
      // バンカーの点数のほうが大きい場合
    } else if (playerPoint < bankerPoint) {

      // 賭けたチップは没収
      chip = chip - bet;
      $(".result").html("バンカーの勝ち… -" + bet + "枚");
      $(".result").css("color", "#6bb6ff");

      // 引き分けの場合
    } else {
      // 賭けたチップは変わらない
      $(".result").html("引き分け");
      $(".result").css("color", "#ffe9a8");
    }

    // 所持チップの枚数を更新する
    $(".score").html("所持チップ " + chip + "枚");

    // 負けてチップが減り、賭け数のほうが多くなってしまったら、賭けられるチップの数を所有枚数に合わせる分岐
    if (bet > chip) {
      bet = chip;
      $(".bet-number").html(bet + "枚");
    }

    // 3回戦目が終わった、またはチップが0枚になったらゲーム終了
    // || ：「または」を表す！どちらか1つでも当てはまれば実行される！
    if (round === maxRound || chip === 0) {
      // 最終結果を出す！
      GameFinish = true;

      $(".deal").fadeOut(1000);

      // チップが15枚を超えているかどうかで最終結果を決める
      if (chip > goalChip) {
        $(".final").html("最終結果：チップ " + chip + "枚でプレイヤーの勝ち！");
        $(".final").css("color", "#ff6b7a");
      } else {
        $(".final").html("最終結果：チップ " + chip + "枚でプレイヤーの負け");
        $(".final").css("color", "#6bb6ff");
      }

      $(".final").fadeOut(0);
      $(".final").fadeIn(2000);

      // まだ3ゲーム終えていなければ、ボタンの文字を「次のゲームへ」に変える
    } else {
      $(".deal").html("次のゲームへ");
    }
  }

});
