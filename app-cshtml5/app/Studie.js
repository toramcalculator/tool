/* Generated by JSIL v0.8.2 build 30747. See http://jsil.org/ for more information. */ 
'use strict';
var $asm_Studie = JSIL.DeclareAssembly("Studie, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null");

/* class ??Studie??Component??App??Xaml??Factory */ 

(function $1c0$1c0Studie$1c0$1c0Component$1c0$1c0App$1c0$1c0Xaml$1c0$1c0Factory$Members () {
  var $, $thisType;
  var $T00 = function () {
    return ($T00 = JSIL.Memoize($asm_CSharpXamlForHtml5.CSHTML5.Internal.TypeInstantiationHelper)) ();
  };
  var $T01 = function () {
    return ($T01 = JSIL.Memoize($asm_Studie.Studie.App)) ();
  };

  function $1c0$1c0Studie$1c0$1c0Component$1c0$1c0App$1c0$1c0Xaml$1c0$1c0Factory_Instantiate () {
    return $T00()['Instantiate']($T01().__Type__);
  };

  JSIL.MakeStaticClass("\u01c0\u01c0Studie\u01c0\u01c0Component\u01c0\u01c0App\u01c0\u01c0Xaml\u01c0\u01c0Factory", true, [], function ($interfaceBuilder) {
    $ = $interfaceBuilder;

    $.Method({Static:true , Public:true }, "Instantiate", 
      JSIL.MethodSignature.Return($.Object), 
      $1c0$1c0Studie$1c0$1c0Component$1c0$1c0App$1c0$1c0Xaml$1c0$1c0Factory_Instantiate
    );

    return function (newThisType) { $thisType = newThisType; }; 
  });

})();

/* class ??Studie??Component??Mainpage??Xaml??Factory */ 

(function $1c0$1c0Studie$1c0$1c0Component$1c0$1c0Mainpage$1c0$1c0Xaml$1c0$1c0Factory$Members () {
  var $, $thisType;
  var $T00 = function () {
    return ($T00 = JSIL.Memoize($asm_CSharpXamlForHtml5.CSHTML5.Internal.TypeInstantiationHelper)) ();
  };
  var $T01 = function () {
    return ($T01 = JSIL.Memoize($asm_Studie.Studie.MainPage)) ();
  };

  function $1c0$1c0Studie$1c0$1c0Component$1c0$1c0Mainpage$1c0$1c0Xaml$1c0$1c0Factory_Instantiate () {
    return $T00()['Instantiate']($T01().__Type__);
  };

  JSIL.MakeStaticClass("\u01c0\u01c0Studie\u01c0\u01c0Component\u01c0\u01c0Mainpage\u01c0\u01c0Xaml\u01c0\u01c0Factory", true, [], function ($interfaceBuilder) {
    $ = $interfaceBuilder;

    $.Method({Static:true , Public:true }, "Instantiate", 
      JSIL.MethodSignature.Return($.Object), 
      $1c0$1c0Studie$1c0$1c0Component$1c0$1c0Mainpage$1c0$1c0Xaml$1c0$1c0Factory_Instantiate
    );

    return function (newThisType) { $thisType = newThisType; }; 
  });

})();

JSIL.DeclareNamespace("Studie");
/* class Studie.App */ 

(function App$Members () {
  var $, $thisType;
  var $T00 = function () {
    return ($T00 = JSIL.Memoize($asm_CSharpXamlForHtml5.Windows.UI.Xaml.Application)) ();
  };
  var $T01 = function () {
    return ($T01 = JSIL.Memoize($asm_Studie.Studie.MainPage)) ();
  };
  var $T02 = function () {
    return ($T02 = JSIL.Memoize($asm_CSharpXamlForHtml5.Windows.UI.Xaml.Window)) ();
  };
  var $T03 = function () {
    return ($T03 = JSIL.Memoize($asm_CSharpXamlForHtml5.Windows.UI.Xaml.UIElement)) ();
  };
  var $T04 = function () {
    return ($T04 = JSIL.Memoize($asm_CSharpXamlForHtml5.CSHTML5.Internal.StartupAssemblyInfo)) ();
  };
  var $T05 = function () {
    return ($T05 = JSIL.Memoize($asm_CSharpXamlForHtml5.Windows.UI.Xaml.ResourceDictionary)) ();
  };

  function App__ctor () {
    $T00().prototype['_ctor'].call(this);
    this['InitializeComponent']();
    var content = new ($T01())();
    $T02().Window$Current$value['set_Content'](content);
  };

  function App_InitializeComponent () {
    if (!this._contentLoaded) {
      this._contentLoaded = true;
      if (false) {
        $T03().$Cast(this).XamlSourcePath = "Studie\\App.xaml";
      }
      $T04().OutputRootPath = "Output\\";
      $T04().OutputAppFilesPath = "app-cshtml5\\app\\";
      $T04().OutputLibrariesPath = "app-cshtml5\\libs\\";
      $T04().OutputResourcesPath = "app-cshtml5\\res\\";
      var resources = new ($T05())();
      this['set_Resources'](resources);
      this['set_Resources'](resources);
    }
  };

  JSIL.MakeType({
      BaseType: $asm_CSharpXamlForHtml5.TypeRef("Windows.UI.Xaml.Application"), 
      Name: "Studie.App", 
      IsPublic: true, 
      IsReferenceType: true, 
      MaximumConstructorArguments: 0, 
    }, function ($interfaceBuilder) {
    $ = $interfaceBuilder;

    $.Method({Static:false, Public:true }, ".ctor", 
      JSIL.MethodSignature.Void, 
      App__ctor
    );

    $.Method({Static:false, Public:true }, "InitializeComponent", 
      JSIL.MethodSignature.Void, 
      App_InitializeComponent
    );

    $['Field']({Static:false, Public:false}, "_contentLoaded", $.Boolean); 
    return function (newThisType) { $thisType = newThisType; }; 
  });

})();

/* class Studie.MainPage */ 

(function MainPage$Members () {
  var $, $thisType;
  var $T00 = function () {
    return ($T00 = JSIL.Memoize($asm_CSharpXamlForHtml5.Windows.UI.Xaml.Controls.Page)) ();
  };
  var $T01 = function () {
    return ($T01 = JSIL.Memoize($asm_CSharpXamlForHtml5_System_dll.System.Net.WebClient)) ();
  };
  var $T02 = function () {
    return ($T02 = JSIL.Memoize($asm_mscorlib.System.Text.Encoding)) ();
  };
  var $T03 = function () {
    return ($T03 = JSIL.Memoize($asm_CSharpXamlForHtml5_System_dll.System.Net.WebHeaderCollection)) ();
  };
  var $T04 = function () {
    return ($T04 = JSIL.Memoize($asm_mscorlib.System.String)) ();
  };
  var $T05 = function () {
    return ($T05 = JSIL.Memoize($asm_CSharpXamlForHtml5.Windows.UI.Xaml.Controls.TextBox)) ();
  };
  var $T06 = function () {
    return ($T06 = JSIL.Memoize($asm_mscorlib.System.Boolean)) ();
  };
  var $T07 = function () {
    return ($T07 = JSIL.Memoize($asm_mscorlib.System.Int32)) ();
  };
  var $T08 = function () {
    return ($T08 = JSIL.Memoize($asm_CSharpXamlForHtml5.Windows.UI.Xaml.UIElement)) ();
  };
  var $T09 = function () {
    return ($T09 = JSIL.Memoize($asm_CSharpXamlForHtml5.Windows.UI.Xaml.Controls.Grid)) ();
  };
  var $T0A = function () {
    return ($T0A = JSIL.Memoize($asm_CSharpXamlForHtml5.Windows.UI.Xaml.Controls.UserControl)) ();
  };
  var $T0B = function () {
    return ($T0B = JSIL.Memoize($asm_CSharpXamlForHtml5.Windows.UI.Xaml.FrameworkElement)) ();
  };
  var $T0C = function () {
    return ($T0C = JSIL.Memoize($asm_mscorlib.System.Collections.ObjectModel.Collection$b1.Of($asm_CSharpXamlForHtml5.Windows.UI.Xaml.UIElement))) ();
  };
  var $T0D = function () {
    return ($T0D = JSIL.Memoize($asm_CSharpXamlForHtml5.Windows.UI.Xaml.Controls.Panel)) ();
  };
  var $S00 = function () {
    return ($S00 = JSIL.Memoize(new JSIL.MethodSignature(null, [$asm_mscorlib.TypeRef("System.String"), $asm_mscorlib.TypeRef("System.String")]))) ();
  };
  var $S01 = function () {
    return ($S01 = JSIL.Memoize(new JSIL.MethodSignature($asm_mscorlib.TypeRef("System.String"), [$asm_mscorlib.TypeRef("System.String")]))) ();
  };

  function MainPage__ctor () {
    $T00().prototype['_ctor'].call(this);
    this['InitializeComponent']();
    var webClient = new ($T01())();
    webClient.WebClient$Encoding$value = $T02()['get_UTF8']();
    $S00().CallVirtual("Add", null, webClient['get_Headers'](), "origin", "dcinside.com");
    var text = $S01().CallVirtual("DownloadString", null, webClient, "http://alloworigincors.herokuapp.com/http://gall.dcinside.com/mgallery/board/view/?id=toramonline&no=26051&page=1");
    (this.PrintScreen)['set_Text'](text);
  };

  function MainPage_CutString (data, start, end) {
    var flag = ((data.indexOf(start)) === -1) || 
    ((data.lastIndexOf(end)) === -1);
    if (flag) {
      var result = data;
    } else {
      result = (data.substr((((data.indexOf(start)) + (start.length | 0)) | 0), data.lastIndexOf(end)));
    }
    return result;
  };

  function MainPage_InitializeComponent () {
    if (!this._contentLoaded) {
      this._contentLoaded = true;
      if (this !== null) {
        $T08().$Cast(this).XamlSourcePath = "Studie\\MainPage.xaml";
      }
      var grid = new ($T09())();
      var textBox = new ($T05())();
      $T0A().prototype['RegisterName'].call(this, "PrintScreen", textBox);
      textBox['set_Name']("PrintScreen");
      (grid['get_Children']())['Add'](textBox);
      this['set_Content'](grid);
      this.PrintScreen = textBox;
    }
  };

  JSIL.MakeType({
      BaseType: $asm_CSharpXamlForHtml5.TypeRef("Windows.UI.Xaml.Controls.Page"), 
      Name: "Studie.MainPage", 
      IsPublic: true, 
      IsReferenceType: true, 
      MaximumConstructorArguments: 0, 
    }, function ($interfaceBuilder) {
    $ = $interfaceBuilder;

    $.Method({Static:false, Public:true }, ".ctor", 
      JSIL.MethodSignature.Void, 
      MainPage__ctor
    );

    $.Method({Static:false, Public:false}, "CutString", 
      new JSIL.MethodSignature($.String, [
          $.String, $.String, 
          $.String
        ]), 
      MainPage_CutString
    );

    $.Method({Static:false, Public:true }, "InitializeComponent", 
      JSIL.MethodSignature.Void, 
      MainPage_InitializeComponent
    );

    $['Field']({Static:false, Public:false}, "PrintScreen", $asm_CSharpXamlForHtml5.TypeRef("Windows.UI.Xaml.Controls.TextBox")); 
    $['Field']({Static:false, Public:false}, "_contentLoaded", $.Boolean); 
    $.ImplementInterfaces(
    );

    return function (newThisType) { $thisType = newThisType; }; 
  });

})();

