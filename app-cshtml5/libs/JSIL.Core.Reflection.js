"use strict";

if (typeof (JSIL) === "undefined")
  throw new Error("JSIL.Core is required");

if (!$jsilcore)  
  throw new Error("JSIL.Core is required");

JSIL.ReflectionGetTypeInternal = function (thisAssembly, name, throwOnFail, ignoreCase) {
  var parsed = JSIL.ParseTypeName(name);

  var result = JSIL.GetTypeInternal(parsed, thisAssembly, false);

  // HACK: Emulate fallback to global namespace search.
  if (!result) {
    result = JSIL.GetTypeInternal(parsed, JSIL.GlobalNamespace, false);
  }

  if (!result) {
    if (throwOnFail)
      throw new System.TypeLoadException("The type '" + name + "' could not be found in the assembly '" + thisAssembly.toString() + "' or in the global namespace.");
    else
      return null;
  }

  return result;
};

JSIL.ImplementExternals(
  "System.Type", function ($) {
    var typeReference = $jsilcore.TypeRef("System.Type");
    var memberArray = new JSIL.TypeRef($jsilcore, "System.Array", ["System.Reflection.MemberInfo"]);
    var fieldArray = new JSIL.TypeRef($jsilcore, "System.Array", ["System.Reflection.FieldInfo"]);
    var propertyArray = new JSIL.TypeRef($jsilcore, "System.Array", ["System.Reflection.PropertyInfo"]);
    var methodArray = new JSIL.TypeRef($jsilcore, "System.Array", ["System.Reflection.MethodInfo"]);
    var constructorArray = new JSIL.TypeRef($jsilcore, "System.Array", ["System.Reflection.ConstructorInfo"]);
    var eventArray = new JSIL.TypeRef($jsilcore, "System.Array", ["System.Reflection.EventInfo"]);
    var typeArray = new JSIL.TypeRef($jsilcore, "System.Array", ["System.Type"]);

    $.Method({Public: true , Static: true }, "op_Equality",
      new JSIL.MethodSignature($.Boolean, [$.Type, $.Type]),
      function (lhs, rhs) {
        if (lhs === rhs)
          return true;

        return String(lhs) == String(rhs);
      }
    );

    $.Method({Public: true , Static: true }, "op_Inequality",
      new JSIL.MethodSignature($.Boolean, [$.Type, $.Type]),
      function (lhs, rhs) {
        if (lhs !== rhs)
          return true;

        return String(lhs) != String(rhs);
      }
    );

    $.Method({Static:false, Public:true }, "get_IsGenericType",
      new JSIL.MethodSignature($.Boolean, []),
      JSIL.TypeObjectPrototype.get_IsGenericType
    );

    $.Method({Static:false, Public:true }, "get_IsGenericTypeDefinition",
      new JSIL.MethodSignature($.Boolean, []),
      JSIL.TypeObjectPrototype.get_IsGenericTypeDefinition
    );

    $.Method({Static:false, Public:true }, "get_ContainsGenericParameters",
      new JSIL.MethodSignature($.Boolean, []),
      JSIL.TypeObjectPrototype.get_ContainsGenericParameters
    );
    
    $.Method({Static:false, Public:true }, "GetGenericTypeDefinition",
      (new JSIL.MethodSignature($.Type, [], [])),
      function () {
        if (this.get_IsGenericType() === false)
          throw new System.Exception("The current type is not a generic type.");
        return this.__OpenType__ || this;
      }
    );

    $.Method({Static:false, Public:true }, "GetGenericArguments",
      (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$.Type]), [], [])), 
      function GetGenericArguments () {
        return JSIL.Array.New(typeReference.get(), this.__GenericArgumentValues__);
      }
    );

    $.Method({Static:false, Public:true }, "MakeGenericType",
      (new JSIL.MethodSignature($.Type, [$jsilcore.TypeRef("System.Array", [$.Type])], [])), 
      function (typeArguments) {
        return this.__PublicInterface__.Of.apply(this.__PublicInterface__, typeArguments).__Type__;
      }
    );

    $.Method({Static:false, Public:true }, "get_IsArray",
      new JSIL.MethodSignature($.Boolean, []),
      JSIL.TypeObjectPrototype.get_IsArray
    );
    
    $.Method({Public: true , Static: false}, "get_IsValueType",
      new JSIL.MethodSignature($.Boolean, []),
      JSIL.TypeObjectPrototype.get_IsValueType
    );
    
    $.Method({Public: true , Static: false}, "get_IsEnum",
      new JSIL.MethodSignature($.Boolean, []),
      JSIL.TypeObjectPrototype.get_IsEnum
    );

    $.Method({Static:false, Public:true }, "GetElementType",
      new JSIL.MethodSignature($.Type, []),
      function () {
        return this.__ElementType__;
      }
    );
    
    $.Method({Public: true , Static: false}, "get_BaseType",
      new JSIL.MethodSignature($.Type, []),
      JSIL.TypeObjectPrototype.get_BaseType
    );

    $.Method({ Public: true, Static: false }, "get_GenericTypeArguments",
    new JSIL.MethodSignature(typeArray, []),
          function () {
              return this.__GenericArgumentValues__;
          }
    );

    $.Method({Public: true , Static: false}, "get_Name",
      new JSIL.MethodSignature($.String, []),
      JSIL.TypeObjectPrototype.get_Name
    );

    $.Method({Public: true , Static: false}, "get_FullName",
      new JSIL.MethodSignature($.String, []),
      JSIL.TypeObjectPrototype.get_FullName
    );

    $.Method({Public: true , Static: false}, "get_Assembly",
      new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.Assembly"), []),
      JSIL.TypeObjectPrototype.get_Assembly
    );

    $.Method({Public: true , Static: false}, "get_Namespace",
      new JSIL.MethodSignature($.String, []),
      JSIL.TypeObjectPrototype.get_Namespace
    );
    
    $.Method({Public: true , Static: false}, "get_AssemblyQualifiedName",
      new JSIL.MethodSignature($.String, []),
      JSIL.TypeObjectPrototype.get_AssemblyQualifiedName
    );

    $.Method({Public: true , Static: false}, "toString",
      new JSIL.MethodSignature($.String, []),
      function () {
        return this.__FullName__;
      }
    );

    $.Method({Public: true , Static: false}, "IsSubclassOf",
      new JSIL.MethodSignature($.Boolean, [$.Type]),
      function (type) {
        var needle = type.__PublicInterface__.prototype;
        var haystack = this.__PublicInterface__.prototype;
        return JSIL.CheckDerivation(haystack, needle);
      }
    );

    $.Method({Public: true , Static: false}, "IsAssignableFrom",
      new JSIL.MethodSignature($.Boolean, [$.Type]),
      function (type) {
        if (type === this)
          return true;

        if (this._IsAssignableFrom)
          return this._IsAssignableFrom.call(this, type);
        else
          return false;
      }
    );

    $.Method({Public: true , Static: false}, "GetMembers",
      new JSIL.MethodSignature(memberArray, []),      
      function () {
        return JSIL.GetMembersInternal(
          this, 
          defaultFlags()
        );
      }
    );

    $.Method({Public: true , Static: false}, "GetMembers",
      new JSIL.MethodSignature(memberArray, [$jsilcore.TypeRef("System.Reflection.BindingFlags")]),      
      function (flags) {
        return JSIL.GetMembersInternal(
          this, flags
        );
      }
    );

    $.Method({ Public: true, Static: false }, "GetMember",
      new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.Reflection.MemberInfo")]), [$.String, $jsilcore.TypeRef("System.Reflection.BindingFlags")]),
      function (memberName, flags) {
          var finalFlags = flags;
          if (finalFlags == undefined) {
              finalFlags = defaultFlags();
          }
          return JSIL.GetMembersInternal(
            this,
            finalFlags,
            null,
            memberName
          );
      }
    );

    var getMatchingMethodsImpl = function (type, name, flags, argumentTypes, returnType, allMethods) {
      var methods = JSIL.GetMembersInternal(
        type, flags, allMethods ? "$AllMethods" : "MethodInfo", name
      );

      if (argumentTypes)
        JSIL.$FilterMethodsByArgumentTypes(methods, argumentTypes, returnType);

      JSIL.$ApplyMemberHiding(type, methods, type.__PublicInterface__.prototype);

      return methods;
    }

    var getMethodImpl = function (type, name, flags, argumentTypes) {
      var methods = getMatchingMethodsImpl(type, name, flags, argumentTypes);

      if (methods.length > 1) {
        throw new System.Exception("Multiple methods named '" + name + "' were found.");
      } else if (methods.length < 1) {
        return null;
      }

      return methods[0];
    };

    $.RawMethod(false, "$GetMatchingInstanceMethods", function (name, argumentTypes, returnType) {
      var bindingFlags = $jsilcore.BindingFlags;
      var flags = bindingFlags.Public | bindingFlags.NonPublic | bindingFlags.Instance;

      return getMatchingMethodsImpl(
        this, name, flags, 
        argumentTypes, returnType, true
      );
    });

    $.Method({Public: true , Static: false}, "GetMethod",
      new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.MethodInfo"), [$.String]),      
      function (name) {
        return getMethodImpl(this, name, defaultFlags(), null);
      }
    );

    $.Method({Public: true , Static: false}, "GetMethod",
      new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.MethodInfo"), [$.String, $jsilcore.TypeRef("System.Reflection.BindingFlags")]),      
      function (name, flags) {
        return getMethodImpl(this, name, flags, null);
      }
    );

    $.Method({Public: true , Static: false}, "GetMethod",
      new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.MethodInfo"), [$.String, typeArray]),      
      function (name, argumentTypes) {
        return getMethodImpl(this, name, defaultFlags(), argumentTypes);
      }
    );
    
    $.Method({Public: true , Static: false}, "GetMethod",
      new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.MethodInfo"), [$.String, $jsilcore.TypeRef("System.Reflection.BindingFlags"), $jsilcore.TypeRef("System.Reflection.Binder"), typeArray, $jsilcore.TypeRef("System.Array", ["System.Reflection.ParameterModifier"])]),      
      function (name, flags, binder, argumentTypes, modifiers) {
        if (binder !== null || modifiers !== null) {
          throw new System.NotImplementedException("Binder and ParameterModifier are not supported yet.");
        }
        return getMethodImpl(this, name, flags, argumentTypes);
      }
    );

    $.Method({Public: true , Static: false}, "GetMethods",
      new JSIL.MethodSignature(methodArray, []),      
      function () {
        return JSIL.GetMembersInternal(
          this, 
          System.Reflection.BindingFlags.Instance | 
          System.Reflection.BindingFlags.Static | 
          System.Reflection.BindingFlags.Public,
          "MethodInfo"
        );
      }
    );

    $.Method({Public: true , Static: false}, "GetMethods",
      new JSIL.MethodSignature(methodArray, [$jsilcore.TypeRef("System.Reflection.BindingFlags")]),      
      function (flags) {
        return JSIL.GetMembersInternal(
          this, flags, "MethodInfo"
        );
      }
    );

    $.Method({Public: true , Static: false}, "GetEvents",
      new JSIL.MethodSignature(eventArray, []),      
      function () {
        return JSIL.GetMembersInternal(
          this, 
          System.Reflection.BindingFlags.Instance | 
          System.Reflection.BindingFlags.Static | 
          System.Reflection.BindingFlags.Public,
          "EventInfo"
        );
      }
    );

    $.Method({Public: true , Static: false}, "GetEvents",
      new JSIL.MethodSignature(eventArray, [$jsilcore.TypeRef("System.Reflection.BindingFlags")]),      
      function (flags) {
        return JSIL.GetMembersInternal(
          this, flags, "EventInfo"
        );
      }
    );

    var getConstructorImpl = function (self, flags, argumentTypes) {
      var constructors = JSIL.GetMembersInternal(
        self, flags, "ConstructorInfo"
      );

      JSIL.$FilterMethodsByArgumentTypes(constructors, argumentTypes);

      JSIL.$ApplyMemberHiding(self, constructors, self.__PublicInterface__.prototype);

      if (constructors.length > 1) {
        throw new System.Exception("Multiple constructors were found.");
      } else if (constructors.length < 1) {
        return null;
      }

      return constructors[0];
    };

    $.Method({Public: true , Static: false}, "GetConstructor",
      new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.ConstructorInfo"), [typeArray]),      
      function (argumentTypes) {
          //note: doing the following instead of directly using System.Reflection.BindingFlags.Instance (for example) makes us avoid a random "number expected" error that happens on IE after passing through this method a certain amount of time.
          var bindingsFlagsInstanceValue = System.Reflection.BindingFlags.Instance.value != undefined ? System.Reflection.BindingFlags.Instance.value : System.Reflection.BindingFlags.Instance;
          var bindingsFlagsStaticValue = System.Reflection.BindingFlags.Static.value != undefined ? System.Reflection.BindingFlags.Static.value : System.Reflection.BindingFlags.Static;
          var bindingsFlagsPublicValue = System.Reflection.BindingFlags.Public.value != undefined ? System.Reflection.BindingFlags.Public.value : System.Reflection.BindingFlags.Public;
          var bindingsFlagsDeclaredOnlyValue = System.Reflection.BindingFlags.DeclaredOnly.value != undefined ? System.Reflection.BindingFlags.DeclaredOnly.value : System.Reflection.BindingFlags.DeclaredOnly;

          var flags =
            bindingsFlagsInstanceValue |
            bindingsFlagsStaticValue |
            bindingsFlagsPublicValue |
            // FIXME: I think this is necessary to avoid pulling in inherited constructors,
            //  since calling the System.Object constructor to create an instance of String
            //  is totally insane.
            bindingsFlagsDeclaredOnlyValue;
        return getConstructorImpl(this, flags, argumentTypes);
      }
    );

    $.Method({Static:false, Public:true , Virtual:true }, "GetConstructor", 
      new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.ConstructorInfo"), [
          $jsilcore.TypeRef("System.Reflection.BindingFlags"), $jsilcore.TypeRef("System.Reflection.Binder"), 
          $jsilcore.TypeRef("System.Reflection.CallingConventions"), $jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.Type")]), 
          $jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.Reflection.ParameterModifier")])
        ], []), 
      function GetConstructor (bindingAttr, binder, callConvention, types, modifiers) {
        return getConstructorImpl(this, bindingAttr, types);
      }
    );

    $.Method({Static:false, Public:true , Virtual:true }, "GetConstructor", 
      new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.ConstructorInfo"), [
          $jsilcore.TypeRef("System.Reflection.BindingFlags"), $jsilcore.TypeRef("System.Reflection.Binder"), 
          $jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.Type")]), $jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.Reflection.ParameterModifier")])
        ], []), 
      function GetConstructor (bindingAttr, binder, types, modifiers) {
        return getConstructorImpl(this, bindingAttr, types);
      }
    );

    $.Method({Public: true , Static: false}, "GetConstructors",
      new JSIL.MethodSignature(constructorArray, []),      
      function () {
        return JSIL.GetMembersInternal(
          this, 
          System.Reflection.BindingFlags.Instance | 
          System.Reflection.BindingFlags.Static | 
          System.Reflection.BindingFlags.Public |
          // FIXME: I think this is necessary to avoid pulling in inherited constructors,
          //  since calling the System.Object constructor to create an instance of String
          //  is totally insane.
          System.Reflection.BindingFlags.DeclaredOnly,
          "ConstructorInfo"
        );
      }
    );

    $.Method({Public: true , Static: false}, "GetConstructors",
      new JSIL.MethodSignature(methodArray, [$jsilcore.TypeRef("System.Reflection.BindingFlags")]),      
      function (flags) {
        return JSIL.GetMembersInternal(
          this, flags, "ConstructorInfo"
        );
      }
    );

    $.Method({Public: true , Static: false}, "GetFields",
      new JSIL.MethodSignature(fieldArray, []),      
      function () {
        return JSIL.GetMembersInternal(
          this, 
          System.Reflection.BindingFlags.Instance | 
          System.Reflection.BindingFlags.Static | 
          System.Reflection.BindingFlags.Public,
          "FieldInfo"
        );
      }
    );

    $.Method({Public: true , Static: false}, "GetFields",
      new JSIL.MethodSignature(fieldArray, [$jsilcore.TypeRef("System.Reflection.BindingFlags")]),      
      function (flags) {
        return JSIL.GetMembersInternal(
          this, flags, "FieldInfo"
        );
      }
    );

    $.Method({Public: true , Static: false}, "GetProperties",
      new JSIL.MethodSignature(propertyArray, []),      
      function () {
        return JSIL.GetMembersInternal(
          this, 
          System.Reflection.BindingFlags.Instance | 
          System.Reflection.BindingFlags.Static | 
          System.Reflection.BindingFlags.Public,
          "PropertyInfo"
        );
      }
    );

    $.Method({Public: true , Static: false}, "GetProperties",
      new JSIL.MethodSignature(propertyArray, [$jsilcore.TypeRef("System.Reflection.BindingFlags")]),      
      function (flags) {
        return JSIL.GetMembersInternal(
          this, flags, "PropertyInfo"
        );
      }
    );

    var getSingleFiltered = function (self, name, flags, type) {
      var members = JSIL.GetMembersInternal(self, flags, type);
      var result = null;

      for (var i = 0, l = members.length; i < l; i++) {
        var member = members[i];
        if (member.Name === name) {
            if (!result)
                result = member;
            else { // if we found more than one result, it means that is is either a bug or an override:
                var resultDeclaringTypeFullName = result.DeclaringType.FullName;
                var memberDeclaringTypeFullName = member.DeclaringType.FullName;
                if (resultDeclaringTypeFullName == memberDeclaringTypeFullName) { // this is a bug: we have two definitions for the same name, flag (public/private) and type (property, field..) on the same type
                    throw new System.Reflection.AmbiguousMatchException("Multiple matches found");
                }
                else { // we have an override: we need to find the "last" one between the former result and the current one.
                    var currentType = self;
                    while (currentType != null && currentType.FullName != resultDeclaringTypeFullName && currentType.FullName != memberDeclaringTypeFullName) {
                        currentType = currentType.BaseType;
                    }
                    if (currentType == null) {
                        throw new System.Exception("This exception should be impossible to reach. How did you do that?");
                    }
                    if (resultDeclaringTypeFullName != currentType.FullName) {
                        result = member;
                    }
                }
            }
        }
      }

      return result;
    };

    var defaultFlags = function () {
      var bindingFlags = $jsilcore.BindingFlags;
      var result = bindingFlags.Public | bindingFlags.Instance | bindingFlags.Static;
      return result;
      // return System.Reflection.BindingFlags.$Flags("Public", "Instance", "Static");
    };

    $.Method({Public: true , Static: false}, "GetField",
      new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.FieldInfo"), [$.String]),      
      function (name) {
        return getSingleFiltered(this, name, defaultFlags(), "FieldInfo");
      }
    );

    $.Method({Public: true , Static: false}, "GetField",
      new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.FieldInfo"), [$.String, $jsilcore.TypeRef("System.Reflection.BindingFlags")]),      
      function (name, flags) {
        return getSingleFiltered(this, name, flags, "FieldInfo");
      }
    );

    $.Method({Public: true , Static: false}, "GetProperty",
      new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.PropertyInfo"), [$.String]),      
      function (name) {
        return getSingleFiltered(this, name, defaultFlags(), "PropertyInfo");
      }
    );

    $.Method({Public: true , Static: false}, "GetProperty",
      new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.PropertyInfo"), [$.String, $jsilcore.TypeRef("System.Reflection.BindingFlags")]),      
      function (name, flags) {
        return getSingleFiltered(this, name, flags, "PropertyInfo");
      }
    );

    $.Method({Public: true , Static: false}, "GetType",
      new JSIL.MethodSignature($.Type, []),
      function () {
        return $jsilcore.System.Type.__Type__;
      }
    );
    
    $.Method({Public: true , Static: false}, "get_IsGenericParameter",
      new JSIL.MethodSignature($.Type, []),
      JSIL.TypeObjectPrototype.get_IsGenericParameter
    );
    
    $.Method({Public: true , Static: false}, "get_IsInterface",
      new JSIL.MethodSignature($.Type, []),
      JSIL.TypeObjectPrototype.get_IsInterface
    );
    
    $.Method({Public: true , Static: false}, "get_IsByRef",
      new JSIL.MethodSignature($.Type, []),
      JSIL.TypeObjectPrototype.get_IsByRef
    );

    $.Method({ Public: true, Static: false }, "GetInterfaces",
      new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$.Type]), []),
      function () {
        return JSIL.GetInterfacesImplementedByType(this, true, false);
      }
    );

    var $T00 = function () {
      return ($T00 = JSIL.Memoize($jsilcore.System.Type)) ();
    };
    var $T01 = function () {
      return ($T01 = JSIL.Memoize($jsilcore.System.TypeCode)) ();
    };
    var $T02 = function () {
      return ($T02 = JSIL.Memoize($jsilcore.System.Boolean)) ();
    };
    var $T03 = function () {
      return ($T03 = JSIL.Memoize($jsilcore.System.Byte)) ();
    };
    var $T04 = function () {
      return ($T04 = JSIL.Memoize($jsilcore.System.Char)) ();
    };
    var $T05 = function () {
      return ($T05 = JSIL.Memoize($jsilcore.System.DateTime)) ();
    };
    var $T06 = function () {
      return ($T06 = JSIL.Memoize($jsilcore.System.Decimal)) ();
    };
    var $T07 = function () {
      return ($T07 = JSIL.Memoize($jsilcore.System.Double)) ();
    };
    var $T08 = function () {
      return ($T08 = JSIL.Memoize($jsilcore.System.Int16)) ();
    };
    var $T09 = function () {
      return ($T09 = JSIL.Memoize($jsilcore.System.Int32)) ();
    };
    var $T0A = function () {
      return ($T0A = JSIL.Memoize($jsilcore.System.Int64)) ();
    };
    var $T0B = function () {
      return ($T0B = JSIL.Memoize($jsilcore.System.SByte)) ();
    };
    var $T0C = function () {
      return ($T0C = JSIL.Memoize($jsilcore.System.Single)) ();
    };
    var $T0D = function () {
      return ($T0D = JSIL.Memoize($jsilcore.System.String)) ();
    };
    var $T0E = function () {
      return ($T0E = JSIL.Memoize($jsilcore.System.UInt16)) ();
    };
    var $T0F = function () {
      return ($T0F = JSIL.Memoize($jsilcore.System.UInt32)) ();
    };
    var $T10 = function () {
      return ($T10 = JSIL.Memoize($jsilcore.System.UInt64)) ();
    };

    $.Method({Static:true , Public:true }, "GetTypeCode", 
      new JSIL.MethodSignature($jsilcore.TypeRef("System.TypeCode"), [$jsilcore.TypeRef("System.Type")]), 
      function Type_GetTypeCode (type) {
        if ($T00().op_Equality(type, null)) {
          var result = $T01().Empty;
        } else if ($T00().op_Equality(type, $T02().__Type__)) {
          result = $T01().Boolean;
        } else if ($T00().op_Equality(type, $T03().__Type__)) {
          result = $T01().Byte;
        } else if ($T00().op_Equality(type, $T04().__Type__)) {
          result = $T01().Char;
        } else if ($T00().op_Equality(type, $T05().__Type__)) {
          result = $T01().DateTime;
        } else if ($T00().op_Equality(type, $T06().__Type__)) {
          result = $T01().Decimal;
        } else if ($T00().op_Equality(type, $T07().__Type__)) {
          result = $T01().Double;
        } else if ($T00().op_Equality(type, $T08().__Type__)) {
          result = $T01().Int16;
        } else if (!(!$T00().op_Equality(type, $T09().__Type__) && !type.get_IsEnum())) {
          result = $T01().Int32;
        } else if ($T00().op_Equality(type, $T0A().__Type__)) {
          result = $T01().Int64;
        } else if ($T00().op_Equality(type, $T0B().__Type__)) {
          result = $T01().SByte;
        } else if ($T00().op_Equality(type, $T0C().__Type__)) {
          result = $T01().Single;
        } else if ($T00().op_Equality(type, $T0D().__Type__)) {
          result = $T01().String;
        } else if ($T00().op_Equality(type, $T0E().__Type__)) {
          result = $T01().UInt16;
        } else if ($T00().op_Equality(type, $T0F().__Type__)) {
          result = $T01().UInt32;
        } else if ($T00().op_Equality(type, $T10().__Type__)) {
          result = $T01().UInt64;
        } else {
          result = $T01().Object;
        }
        return result;
      }   
    );    

  }
);

$jsilcore.MemberInfoExternals = function ($) {
  $.Method({Static:false, Public:true }, "get_DeclaringType", 
    new JSIL.MethodSignature($jsilcore.TypeRef("System.Type"), [], []),
    function () {
      return this._typeObject;
    }
  );

  $.Method({Static:false, Public:true }, "get_Name", 
    new JSIL.MethodSignature($jsilcore.TypeRef("System.String"), [], []),
    function () {
      return this._descriptor.Name;
    }
  );

  $.Method({Static:false, Public:true }, "get_IsSpecialName", 
    new JSIL.MethodSignature($jsilcore.TypeRef("System.Boolean"), [], []),
    function () {
      return this._descriptor.SpecialName === true;
    }
  );

  $.Method({Static:false, Public:true }, "get_IsPublic", 
    new JSIL.MethodSignature($jsilcore.TypeRef("System.Boolean"), [], []),
    function () {
      return this._descriptor.Public;
    }
  );

  $.Method({Static:false, Public:true }, "get_IsStatic", 
    new JSIL.MethodSignature($jsilcore.TypeRef("System.Boolean"), [], []),
    function () {
      return this._descriptor.Static;
    }
  );

  $.Method({Static:false, Public:true }, "GetCustomAttributes", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$.Object]), [$.Boolean], [])), 
    function GetCustomAttributes (inherit) {
      return JSIL.GetMemberAttributes(this, inherit, null);
    }
  );

  $.Method({Static:false, Public:true }, "GetCustomAttributes", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$.Object]), [$jsilcore.TypeRef("System.Type"), $.Boolean], [])), 
    function GetCustomAttributes (attributeType, inherit) {
      return JSIL.GetMemberAttributes(this, inherit, attributeType);
    }
  );

  $.Method({Static:false, Public:true }, "GetCustomAttributesData", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Collections.Generic.IList`1", [$jsilcore.TypeRef("System.Reflection.CustomAttributeData")]), [], [])), 
    function GetCustomAttributesData () {
      throw new Error('Not implemented');
    }
  );
};

JSIL.ImplementExternals(
  "System.Reflection.MemberInfo", $jsilcore.MemberInfoExternals
);

JSIL.ImplementExternals(
  "System.Reflection.PropertyInfo", $jsilcore.MemberInfoExternals
);

JSIL.ImplementExternals(
  "System.Reflection.FieldInfo", $jsilcore.MemberInfoExternals
);

JSIL.ImplementExternals(
  "System.Reflection.MethodBase", function ($) {
    $.RawMethod(false, "InitResolvedSignature",
      function InitResolvedSignature() {
        if (this.resolvedSignature === undefined) {
          this._data.resolvedSignature = this._data.signature.Resolve(this.Name);
          if (this._data.signature.genericArgumentValues !== undefined) {
            this._data.resolvedSignature = this._data.resolvedSignature.ResolvePositionalGenericParameters(this._data.signature.genericArgumentValues)
          }
        }
      }
    );
  
    $.Method({Static:false, Public:false}, "GetParameterTypes", 
      (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.Type")]), [], [])), 
      function GetParameterTypes () {
        var signature = this._data.signature;
        var argumentTypes = signature.argumentTypes;
        var result = [];

        for (var i = 0, l = argumentTypes.length; i < l; i++) {
          var argumentType = argumentTypes[i];
          result.push(signature.ResolveTypeReference(argumentType)[1]);
        }

        return result;
      }
    );

    $.Method({Static: false, Public: true}, "toString",
      new JSIL.MethodSignature($.String, [], []),
      function () {
        // FIXME: Types are encoded as long names, not short names, which is incompatible with .NET
        // i.e. 'System.Int32 Foo()' instead of 'Int32 Foo()'
        return this._data.signature.toString(this.Name);
      }
    );
  }
);

JSIL.ImplementExternals("System.Reflection.PropertyInfo", function ($) {

    //note : this has been done by Userware: from here...
    $.Method({ Static: false, Public: true, Virtual: true }, "SetValue",
      new JSIL.MethodSignature(null, [
      $.Object, $.Object,
      $jsilcore.TypeRef("System.Array", [$.Object])
      ]),
        function SetValue(source, value, index) {
            var setMethod = this.GetSetMethod(true);
            setMethod.Invoke(source, [value]);
        }
       );

    $.Method({ Static: false, Public: true, Virtual: true }, "GetValue",
      new JSIL.MethodSignature($.Object,
        [$.Object,
          $jsilcore.TypeRef("System.Array", [$.Object])
        ]),
        function GetValue(source, index) {
            var getMethod = this.GetGetMethod(true);
            return getMethod.Invoke(source, []);
        }
      );

    //...to here.

  var getGetMethodImpl = function (nonPublic) {
    var methodName = "get_" + this.get_Name();
    var bf = System.Reflection.BindingFlags;
    var instanceOrStatic = this.get_IsStatic() ? "Static" : "Instance";
    var bindingFlags = (nonPublic 
      ? bf.$Flags("DeclaredOnly", instanceOrStatic, "Public", "NonPublic")
      : bf.$Flags("DeclaredOnly", instanceOrStatic, "Public")
    );
    return this.get_DeclaringType().GetMethod(methodName, bindingFlags);
  };

  var getSetMethodImpl = function (nonPublic) {
    var methodName = "set_" + this.get_Name();
    var bf = System.Reflection.BindingFlags;
    var instanceOrStatic = this.get_IsStatic() ? "Static" : "Instance";
    var bindingFlags = (nonPublic 
      ? bf.$Flags("DeclaredOnly", instanceOrStatic, "Public", "NonPublic")
      : bf.$Flags("DeclaredOnly", instanceOrStatic, "Public")
    );
    return this.get_DeclaringType().GetMethod(methodName, bindingFlags);
  };

  var getAccessorsImpl = function (nonPublic) {
    var result = [];

    var getMethod = this.GetGetMethod(nonPublic || false);
    var setMethod = this.GetSetMethod(nonPublic || false);

    if (getMethod)
      result.push(getMethod);
    if (setMethod)
      result.push(setMethod);

    return result;
  };

  $.Method({Static: false, Public: true }, "GetGetMethod", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.MethodInfo"), [], [])),
    getGetMethodImpl
  );

  $.Method({Static: false, Public: true }, "GetGetMethod", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.MethodInfo"), [$.Boolean], [])),
    getGetMethodImpl
  );

  $.Method({Static: false, Public: true }, "GetSetMethod", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.MethodInfo"), [], [])),
    getSetMethodImpl
  );

  $.Method({Static: false, Public: true }, "GetSetMethod", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.MethodInfo"), [$.Boolean], [])),
    getSetMethodImpl
  );

  $.Method({Static: false, Public: true }, "GetAccessors", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.Reflection.MethodInfo")]), [$.Boolean], [])),
    getAccessorsImpl
  );

  $.Method({Static: false, Public: true }, "GetAccessors", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.Reflection.MethodInfo")]), [], [])),
    getAccessorsImpl
  );

  $.Method({Static: false, Public: true }, "GetIndexParameters", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.Reflection.ParameterInfo")]), [], [])),
    function GetIndexParameters () {
      var getMethod = this.GetGetMethod(true);
      if (getMethod)
        return getMethod.GetParameters();

      var setMethod = this.GetSetMethod(true);
      if (setMethod) {
        var result = setMethod.GetParameters();
        return result.slice(0, result.length - 1);
      }

      return [];
    }
  );

  $.Method({Static:false, Public:true }, "get_PropertyType", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Type"), [], [])), 
    function get_PropertyType () {
      var result = this._cachedPropertyType;

      if (!result) {
        var getMethod = this.GetGetMethod(true);
        if (getMethod) {
          result = getMethod.get_ReturnType();
        } else {
          var setMethod = this.GetSetMethod(true);
          if (setMethod) {
            var argumentTypes = setMethod._data.signature.argumentTypes;
            var lastArgumentType = argumentTypes[argumentTypes.length - 1];
            result = JSIL.ResolveTypeReference(lastArgumentType, this._typeObject.__Context__)[1];
          }
        }

        this._cachedPropertyType = result;
      }

      return result;
    }
  );

  $.Method({Static:false, Public:true }, "get_CanRead", 
    (new JSIL.MethodSignature($.Boolean, [], [])), 
    function get_CanRead () {
      return getGetMethodImpl.call(this, true) !== null;
    }
  );

  $.Method({Static:false, Public:true }, "get_CanWrite", 
    (new JSIL.MethodSignature($.Boolean, [], [])), 
    function get_CanWrite () {
      return getSetMethodImpl.call(this, true) !== null;
    }
  );
  
  var equalsImpl = function (lhs, rhs) {
    if (lhs === rhs)
      return true;

    return JSIL.ObjectEquals(lhs, rhs);
  };

  $.Method({Static:true , Public:true }, "op_Equality", 
    (new JSIL.MethodSignature($.Boolean, [$jsilcore.TypeRef("System.Reflection.PropertyInfo"), $jsilcore.TypeRef("System.Reflection.PropertyInfo")], [])), 
    function op_Equality (left, right) {
      return equalsImpl(left, right);
    }
  );

  $.Method({Static:true , Public:true }, "op_Inequality", 
    (new JSIL.MethodSignature($.Boolean, [$jsilcore.TypeRef("System.Reflection.PropertyInfo"), $jsilcore.TypeRef("System.Reflection.PropertyInfo")], [])), 
    function op_Inequality (left, right) {
      return !equalsImpl(left, right);
    }
  );
});

$jsilcore.$MethodGetParameters = function (method) {
  var result = method._cachedParameters;

  if (typeof (result) === "undefined") {
    result = method._cachedParameters = [];
    method.InitResolvedSignature();

    var argumentTypes = method._data.resolvedSignature.argumentTypes;
    var parameterInfos = method._data.parameterInfo;
    var tParameterInfo = $jsilcore.System.Reflection.ParameterInfo.__Type__;

    if (argumentTypes) {
      for (var i = 0; i < argumentTypes.length; i++) {
        var parameterInfo = parameterInfos[i] || null;

        // FIXME: Missing non-type information
        var pi = JSIL.CreateInstanceOfType(tParameterInfo, "$fromArgumentTypeAndPosition", [argumentTypes[i], i]);
        if (parameterInfo)
          pi.$populateWithParameterInfo(parameterInfo);

        result.push(pi);
      }
    }
  }

  return result;
};

JSIL.ImplementExternals("System.Reflection.MethodInfo", function ($) { 
  $.Method({Static: false, Public: true }, "GetParameters", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.Reflection.ParameterInfo")]), [], [])),
    function GetParameters () {
      return $jsilcore.$MethodGetParameters(this);
    }
  );

  $.Method({Static:false, Public:true }, "get_ReturnType", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Type"), [], [])), 
    function get_ReturnType () {
       if (!this._data.signature.returnType)
        return $jsilcore.System.Void.__Type__;	  
      this.InitResolvedSignature();
      return this._data.resolvedSignature.returnType;
    }
  );

  var equalsImpl = function (lhs, rhs) {
    if (lhs === rhs)
      return true;

    return JSIL.ObjectEquals(lhs, rhs);
  };

  $.Method({Static:true , Public:true }, "op_Equality", 
    (new JSIL.MethodSignature($.Boolean, [$jsilcore.TypeRef("System.Reflection.MethodInfo"), $jsilcore.TypeRef("System.Reflection.MethodInfo")], [])), 
    function op_Equality (left, right) {
      return equalsImpl(left, right);
    }
  );

  $.Method({Static:true , Public:true }, "op_Inequality", 
    (new JSIL.MethodSignature($.Boolean, [$jsilcore.TypeRef("System.Reflection.MethodInfo"), $jsilcore.TypeRef("System.Reflection.MethodInfo")], [])), 
    function op_Inequality (left, right) {
      return !equalsImpl(left, right);
    }
  );

  $.Method({Static:false, Public:true , Virtual:true }, "Invoke", 
    new JSIL.MethodSignature($.Object, [
        $.Object, $jsilcore.TypeRef("System.Reflection.BindingFlags"), 
        $jsilcore.TypeRef("System.Reflection.Binder"), $jsilcore.TypeRef("System.Array", [$.Object]), 
        $jsilcore.TypeRef("System.Globalization.CultureInfo")
      ], []), 
    function Invoke (obj, invokeAttr, binder, parameters, culture) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true , Virtual:true }, "Invoke", 
    new JSIL.MethodSignature($.Object, [$.Object, $jsilcore.TypeRef("System.Array", [$.Object])], []), 
    function Invoke (obj, parameters) {
      var impl = JSIL.$GetMethodImplementation(this, obj);

      if (typeof (impl) !== "function")
        throw new System.Exception("Failed to find constructor");

      var parameterTypes = this.GetParameterTypes();
      var parametersCount = 0;
      if (parameters !== null)
        parametersCount = parameters.length;

      if (parameterTypes.length !== parametersCount)
        throw new System.Exception("Parameters count mismatch.");

      if (parameters !== null) {
        parameters = parameters.slice();
        for (var i = 0; i < parametersCount; i++) {
          if (parameters[i] === null && parameterTypes[i].IsValueType)
            parameters[i] = JSIL.DefaultValue(parameterTypes[i]);
        }
      }
      
      if (this.IsStatic) {
        obj = this._typeObject.__PublicInterface__;
      }

      return impl.apply(obj, parameters);
    }
  );

  $.Method({Static:false, Public:true , Virtual:true }, "MakeGenericMethod", 
    new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.MethodInfo"), [$jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.Type")])]),
    function MakeGenericMethod(typeArguments) {
      if (this._data.signature.genericArgumentNames.length === 0)
        throw new System.Exception("Method is not Generic");
      if (this._data.signature.genericArgumentValues !== undefined)
        throw new System.Exception("Method is closed Generic");

      var cacheKey = JSIL.HashTypeArgumentArray(typeArguments, this._data.signature.context);
      var ofCache = this.__OfCache__;
      if (!ofCache)
        this.__OfCache__ = ofCache = {};

      var result = ofCache[cacheKey];
      if (result)
        return result;

      var parsedTypeName = JSIL.ParseTypeName("System.Reflection.MethodInfo");    
      var infoType = JSIL.GetTypeInternal(parsedTypeName, $jsilcore, true);
      var info = JSIL.CreateInstanceOfType(infoType, null);
      info._typeObject = this._typeObject;
      info._descriptor = this._descriptor;
      info.__Attributes__ = this.__Attributes__;
      info.__Overrides__ = this.__Overrides__;

      info._data = {};
	  info._data.parameterInfo = this._data.parameterInfo;

      if (this._data.genericSignature)
        info._data.genericSignature = this._data.genericSignature;

      var source = this._data.signature;
      info._data.signature = new JSIL.MethodSignature(source.returnType, source.argumentTypes, source.genericArgumentNames, source.context, source, typeArguments.slice())

      ofCache[cacheKey]  = info;
      return info;
    }
  );

  $.Method({Public: true , Static: false}, "get_IsGenericMethod",
    new JSIL.MethodSignature($.Type, []),
    function get_IsGenericMethod() {
      return this._data.signature.genericArgumentNames.length !== 0;
    }
  );

  $.Method({Public: true , Static: false}, "get_IsGenericMethodDefinition",
    new JSIL.MethodSignature($.Type, []),
    function get_IsGenericMethodDefinition() {
      return this._data.signature.genericArgumentNames.length !== 0 && this._data.signature.genericArgumentValues === undefined;
    }
  );

  $.Method({Public: true , Static: false}, "get_ContainsGenericParameters",
    new JSIL.MethodSignature($.Type, []),
    function get_IsGenericMethodDefinition() {
      return this.DeclaringType.get_ContainsGenericParameters() || (this._data.signature.genericArgumentNames.length !== 0 && this._data.signature.genericArgumentValues === undefined);
    }
  );
});

JSIL.ImplementExternals(
  "System.Reflection.FieldInfo", function ($) {
    $.Method({Static:false, Public:true }, "get_FieldType", 
      (new JSIL.MethodSignature($jsilcore.TypeRef("System.Type"), [], [])), 
      function get_FieldType () {
        var result = this._cachedFieldType;

        if (typeof (result) === "undefined") {
          result = this._cachedFieldType = JSIL.ResolveTypeReference(
            this._data.fieldType, this._typeObject.__Context__
          )[1];
        }

        return result;
      }
    );

    $.Method({Static:false, Public:true }, "get_IsInitOnly", 
      (new JSIL.MethodSignature($.Boolean, [], [])), 
      function get_IsInitOnly () {
        return this._descriptor.IsReadOnly;
      }
    );

    $.Method({Static:false, Public:true , Virtual:true }, "GetRawConstantValue", 
      new JSIL.MethodSignature($.Object, [], []), 
      function GetRawConstantValue () {
        return this._data.constant;
      }
    );
    
    $.Method({Static:false, Public:true, Virtual:true }, "GetValue",
      (new JSIL.MethodSignature($.Object, [$.Object], [])),
      function GetValue (obj) {
        if (this.IsStatic) {
          return this.DeclaringType.__PublicInterface__[this._descriptor.Name];
        }

        if (obj === null) {
          throw new System.Exception("Non-static field requires a target.");
        }

        if (!this.DeclaringType.IsAssignableFrom(obj.__ThisType__)) {
          throw new System.Exception("Field is not defined on the target object.");
        }

        return obj[this._descriptor.Name];
      }
    );
    
    var equalsImpl = function (lhs, rhs) {
      if (lhs === rhs)
        return true;

      return JSIL.ObjectEquals(lhs, rhs);
    };

    $.Method({Static:true , Public:true }, "op_Equality", 
      (new JSIL.MethodSignature($.Boolean, [$jsilcore.TypeRef("System.Reflection.FieldInfo"), $jsilcore.TypeRef("System.Reflection.FieldInfo")], [])), 
      function op_Equality (left, right) {
        return equalsImpl(left, right);
      }
    );

    $.Method({Static:true , Public:true }, "op_Inequality", 
      (new JSIL.MethodSignature($.Boolean, [$jsilcore.TypeRef("System.Reflection.FieldInfo"), $jsilcore.TypeRef("System.Reflection.FieldInfo")], [])), 
      function op_Inequality (left, right) {
        return !equalsImpl(left, right);
      }
    );
    
    $.Method({Static:false , Public:true }, "get_IsLiteral", 
      (new JSIL.MethodSignature($.Boolean, [], [])), 
      function get_IsLiteral() {
          return this.DeclaringType.IsEnum; //this is not a good implementation but that's how it is for now.
        //return false;
      }
    );

    $.Method({Static:false, Public:true, Virtual:true }, "SetValue",
      (new JSIL.MethodSignature($.Object, [$.Object, $.Object], [])),
      function SetValue (obj, value) {
          var fieldtype = this.get_FieldType();
          if (value === null) {
              if (fieldtype.IsValueType && !fieldtype.__IsNullable__) {
                  throw new System.ArgumentException("value");
              }
          }
          else if (!fieldtype.$Is(value))
                  throw new System.ArgumentException("value");

        if (this.IsStatic) {
          this.DeclaringType.__PublicInterface__[this._descriptor.Name] = value;
          return;
        }

        if (obj === null) {
          throw new System.Exception("Non-static field requires a target.");
        }

        if (!this.DeclaringType.IsAssignableFrom(obj.__ThisType__)) {
          throw new System.Exception("Field is not defined on the target object.");
        }

        obj[this._descriptor.Name] = value;
      }
    );
  }
);

JSIL.MakeClass("System.Object", "System.Reflection.MemberInfo", true, [], function ($) {
    $.Property({Public: true , Static: false, Virtual: true }, "DeclaringType");
    $.Property({Public: true , Static: false, Virtual: true }, "Name");
    $.Property({Public: true , Static: false, Virtual: true }, "IsPublic");
    $.Property({Public: true , Static: false, Virtual: true }, "IsStatic");
    $.Property({Public: true , Static: false, Virtual: true }, "IsSpecialName");
    $.Property({Public: true , Static: false, Virtual: true }, "MemberType");
});

JSIL.MakeClass("System.Reflection.MemberInfo", "System.Type", true, [], function ($) {
    $.Property({Public: true , Static: false, Virtual: true }, "Module");
    $.Property({Public: true , Static: false, Virtual: true }, "Assembly");
    $.Property({Public: true , Static: false, Virtual: true }, "FullName");
    $.Property({Public: true , Static: false, Virtual: true }, "Namespace");
    $.Property({Public: true , Static: false, Virtual: true }, "AssemblyQualifiedName");
    $.Property({Public: true , Static: false, Virtual: true }, "BaseType");
    $.Property({Public: true , Static: false, Virtual: true }, "IsGenericType");
    $.Property({Public: true , Static: false, Virtual: true }, "IsGenericTypeDefinition");
    $.Property({Public: true , Static: false, Virtual: true }, "ContainsGenericParameters");
    $.Property({Public: true , Static: false }, "IsArray");
    $.Property({Public: true , Static: false }, "IsValueType");
    $.Property({Public: true , Static: false }, "IsEnum");
});

JSIL.MakeClass("System.Type", "System.RuntimeType", false, [], function ($) {
  $jsilcore.RuntimeTypeInitialized = true;
});

JSIL.MakeClass("System.Reflection.MemberInfo", "System.Reflection.MethodBase", true, [], function ($) {
    $.Property({Public: true , Static: false, Virtual: true }, "IsGenericMethod");
    $.Property({Public: true , Static: false, Virtual: true }, "IsGenericMethodDefinition");
    $.Property({Public: true , Static: false, Virtual: true }, "ContainsGenericParameters");
});

JSIL.MakeClass("System.Reflection.MethodBase", "System.Reflection.MethodInfo", true, [], function ($) {
    $.Property({Public: true , Static: false}, "ReturnType");
    $.Property({Public: true , Static: false, Virtual: true }, "MemberType");
    $.Method({Public: true , Static: false, Virtual: true }, "get_MemberType", 
      JSIL.MethodSignature.Return($jsilcore.TypeRef("System.Reflection.MemberTypes")), 
      function get_MemberType(){
        return $jsilcore.System.Reflection.MemberTypes.Method;
      }
    );	
});

JSIL.MakeClass("System.Reflection.MethodBase", "System.Reflection.ConstructorInfo", true, [], function ($) {
    $.Property({Public: true , Static: false, Virtual: true }, "MemberType");
    $.Method({Public: true , Static: false, Virtual: true }, "get_MemberType", 
      JSIL.MethodSignature.Return($jsilcore.TypeRef("System.Reflection.MemberTypes")), 
      function get_MemberType(){
        return $jsilcore.System.Reflection.MemberTypes.Constructor;
      }
    );
});

JSIL.MakeClass("System.Reflection.MemberInfo", "System.Reflection.FieldInfo", true, [], function ($) {
    $.Property({Public: true , Static: false}, "FieldType");
    $.Property({Public: true , Static: false, Virtual: true }, "MemberType");
    $.Method({Public: true , Static: false, Virtual: true }, "get_MemberType", 
      JSIL.MethodSignature.Return($jsilcore.TypeRef("System.Reflection.MemberTypes")), 
      function get_MemberType(){
        return $jsilcore.System.Reflection.MemberTypes.Field;
      }
    );
});

JSIL.MakeClass("System.Reflection.MemberInfo", "System.Reflection.EventInfo", true, [], function ($) {
    $.Property({Public: true , Static: false, Virtual: true }, "MemberType");
    $.Method({Public: true , Static: false, Virtual: true }, "get_MemberType", 
      JSIL.MethodSignature.Return($jsilcore.TypeRef("System.Reflection.MemberTypes")), 
      function get_MemberType(){
        return $jsilcore.System.Reflection.MemberTypes.Event;
      }
    );
});

JSIL.MakeClass("System.Reflection.MemberInfo", "System.Reflection.PropertyInfo", true, [], function ($) {
    $.Property({Public: true , Static: false, Virtual: true }, "MemberType");
    $.Method({Public: true , Static: false, Virtual: true }, "get_MemberType", 
      JSIL.MethodSignature.Return($jsilcore.TypeRef("System.Reflection.MemberTypes")), 
      function get_MemberType(){
        return $jsilcore.System.Reflection.MemberTypes.Property;
      }
    );
});

JSIL.MakeClass("System.Object", "System.Reflection.Assembly", true, [], function ($) {
  $.RawMethod(false, ".ctor", function (publicInterface, fullName) {
    JSIL.SetValueProperty(this, "__PublicInterface__", publicInterface);
    JSIL.SetValueProperty(this, "__FullName__", fullName);
  });

  $.Method({Static:true , Public:true }, "op_Equality", 
    (new JSIL.MethodSignature($.Boolean, [$.Type, $.Type], [])), 
    function op_Equality (left, right) {
      return left === right;
    }
  );

  $.Method({Static:true , Public:true }, "op_Inequality", 
    (new JSIL.MethodSignature($.Boolean, [$.Type, $.Type], [])), 
    function op_Inequality (left, right) {
      return left !== right;
    }
  );

  $.Method({Static:false, Public:true }, "get_CodeBase", 
    (new JSIL.MethodSignature($.String, [], [])), 
    function get_CodeBase () {
      // FIXME
      return "CodeBase";
    }
  );

  $.Method({Static:false, Public:true }, "get_FullName", 
    (new JSIL.MethodSignature($.String, [], [])), 
    function get_FullName () {
      return this.__FullName__;
    }
  );

  $.Method({Static:false, Public:true }, "get_Location", 
    (new JSIL.MethodSignature($.String, [], [])), 
    function get_Location () {
      // FIXME
      return "Location";
    }
  );

  $.Method({Static:false, Public:true }, "GetName", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.AssemblyName"), [], [])), 
    function GetName () {
      if (!this._assemblyName)
        this._assemblyName = new System.Reflection.AssemblyName(this.__FullName__);

      return this._assemblyName;
    }
  );

  $.Method({Static:false, Public:true }, "GetType", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Type"), [$.String], [])), 
    function GetType (name) {
      return JSIL.GetTypeFromAssembly(this, name, null, false);
    }
  );

  $.Method({Static:false, Public:true }, "GetType", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Type"), [$.String, $.Boolean], [])), 
    function GetType (name, throwOnError) {
      return JSIL.GetTypeFromAssembly(this, name, null, throwOnError);
    }
  );

  $.Method({Static:false, Public:true }, "GetType", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Type"), [
          $.String, $.Boolean, 
          $.Boolean
        ], [])), 
    function GetType (name, throwOnError, ignoreCase) {
      if (ignoreCase)
        throw new Error("ignoreCase not implemented");
      
      return JSIL.GetTypeFromAssembly(this, name, null, throwOnError);
    }
  );

  $.Method({Static:false, Public:true }, "GetTypes", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.Type")]), [], [])), 
    function GetTypes () {
      return JSIL.GetTypesFromAssembly(this.__PublicInterface__);
    }
  );

  $.Method({Static: true, Public: true}, "GetEntryAssembly",
    (new JSIL.MethodSignature($.Type, [], [])),
    function GetEntryAssembly () {
      // FIXME: Won't work if multiple loaded assemblies contain entry points.
      for (var k in JSIL.$EntryPoints) {
        var ep = JSIL.$EntryPoints[k];
        return ep[0].__Assembly__;
      }

      return null;
    }
  );

  $.Method({Static:false, Public:true , Virtual:true }, "GetManifestResourceStream", 
    new JSIL.MethodSignature($jsilcore.TypeRef("System.IO.Stream"), [$.String], []), 
    function GetManifestResourceStream (name) {
      var assemblyKey = this.__FullName__;
      var firstComma = assemblyKey.indexOf(",");
      if (firstComma)
        assemblyKey = assemblyKey.substr(0, firstComma);

      var files = allManifestResources[assemblyKey];
      if (!files)
        throw new Error("Assembly '" + assemblyKey + "' has no manifest resources");

      var fileKey = name.toLowerCase();

      var bytes = files[fileKey];
      if (!bytes)
        throw new Error("No stream named '" + name + "'");

      var result = new System.IO.MemoryStream(bytes, false);
      return result;
    }
  );

  $.Property({Static: false, Public: true}, "CodeBase");
  $.Property({Static: false, Public: true}, "Location");
  $.Property({Static: false, Public: true}, "FullName");
});

JSIL.MakeClass("System.Reflection.Assembly", "System.Reflection.RuntimeAssembly", true, [], function ($) {
});

JSIL.ImplementExternals("System.Reflection.ParameterInfo", function ($interfaceBuilder) {
  var $ = $interfaceBuilder;

  $.RawMethod(false, "$fromArgumentTypeAndPosition", function (argumentType, position) {
    this.argumentType = argumentType;
    this.position = position;
    this._name = null;
    this.__Attributes__ = [];
  });

  $.RawMethod(false, "$populateWithParameterInfo", function (parameterInfo) {
    this._name = parameterInfo.name || null;

    if (parameterInfo.attributes) {
      var mb = new JSIL.MemberBuilder(null);
      parameterInfo.attributes(mb);
      this.__Attributes__ = mb.attributes;
    }
  });

  $.Method({Static:false, Public:true }, "get_Attributes", 
    new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.ParameterAttributes"), [], []), 
    function get_Attributes () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "get_CustomAttributes", 
    new JSIL.MethodSignature($jsilcore.TypeRef("System.Collections.Generic.IEnumerable`1", [$jsilcore.TypeRef("System.Reflection.CustomAttributeData")]), [], []), 
    function get_CustomAttributes () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "get_DefaultValue", 
    new JSIL.MethodSignature($.Object, [], []), 
    function get_DefaultValue () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "get_HasDefaultValue", 
    new JSIL.MethodSignature($.Boolean, [], []), 
    function get_HasDefaultValue () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "get_Member", 
    new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.MemberInfo"), [], []), 
    function get_Member () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "get_Name", 
    new JSIL.MethodSignature($.String, [], []), 
    function get_Name () {
      if (this._name) {
        return this._name;
      } else {
        return "<unnamed parameter #" + this.position + ">";
      }
    }
  );

  $.Method({Static:false, Public:true }, "get_ParameterType", 
    new JSIL.MethodSignature($jsilcore.TypeRef("System.Type"), [], []), 
    function get_ParameterType () {
      return this.argumentType;
    }
  );

  $.Method({Static:false, Public:true }, "get_Position", 
    new JSIL.MethodSignature($.Int32, [], []), 
    function get_Position () {
      return this.position;
    }
  );

  $.Method({Static:false, Public:true }, "GetCustomAttributes", 
    new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$.Object]), [$.Boolean], []), 
    function GetCustomAttributes (inherit) {
      return JSIL.GetMemberAttributes(this, inherit, null);
    }
  );

  $.Method({Static:false, Public:true }, "GetCustomAttributes", 
    new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$.Object]), [$jsilcore.TypeRef("System.Type"), $.Boolean], []), 
    function GetCustomAttributes (attributeType, inherit) {
      return JSIL.GetMemberAttributes(this, inherit, attributeType);
    }
  );

  $.Method({Static:false, Public:true }, "toString", 
    new JSIL.MethodSignature($.String, [], []), 
    function toString () {
      return this.argumentType.toString() + " " + this.get_Name();
    }
  );
});

JSIL.MakeClass("System.Object", "System.Reflection.ParameterInfo", true, [], function ($) {
    $.Property({Public: true , Static: false, Virtual: true }, "Name");
    $.Property({Public: true , Static: false, Virtual: true }, "ParameterType");
    $.Property({Public: true , Static: false, Virtual: true }, "Position");
});

JSIL.ImplementExternals("System.Reflection.ConstructorInfo", function ($) {
  $.Method({Static: false, Public: true }, "GetParameters", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Array", [$jsilcore.TypeRef("System.Reflection.ParameterInfo")]), [], [])),
    function GetParameters () {
      return $jsilcore.$MethodGetParameters(this);
    }
  );

  $.Method({Static:false, Public:true }, "Invoke", 
    new JSIL.MethodSignature($.Object, [$jsilcore.TypeRef("System.Array", [$.Object])], []), 
    function Invoke (parameters) {
      var impl = JSIL.$GetMethodImplementation(this, null);

      if (typeof (impl) !== "function")
        throw new System.Exception("Failed to find constructor");

      return JSIL.CreateInstanceOfType(this.get_DeclaringType(), impl, parameters);
    }
  );
  
  $.Method({Static: true, Public: true }, "op_Inequality", 
    new JSIL.MethodSignature($.Boolean, [$jsilcore.TypeRef("System.Reflection.ConstructorInfo"), $jsilcore.TypeRef("System.Reflection.ConstructorInfo")], []),
    function op_Inequality (left, right) {
      return left !== right;
    }
  );  
  
  $.Method({Static: true, Public: true }, "op_Equality", 
    new JSIL.MethodSignature($.Boolean, [$jsilcore.TypeRef("System.Reflection.ConstructorInfo"), $jsilcore.TypeRef("System.Reflection.ConstructorInfo")], []),
    function op_Equality (left, right) {
      return left === right;
    }
  ); 
});

JSIL.ImplementExternals("System.Reflection.EventInfo", function ($) {
  var getAddMethodImpl = function (nonPublic) {
    var methodName = "add_" + this.get_Name();
    var bf = System.Reflection.BindingFlags;
    var bindingFlags = (nonPublic 
      ? bf.$Flags("DeclaredOnly", "Instance", "Public", "NonPublic")
      : bf.$Flags("DeclaredOnly", "Instance", "Public")
    );
    return this.get_DeclaringType().GetMethod(methodName, bindingFlags);
  };

  var getRemoveMethodImpl = function (nonPublic) {
    var methodName = "remove_" + this.get_Name();
    var bf = System.Reflection.BindingFlags;
    var bindingFlags = (nonPublic 
      ? bf.$Flags("DeclaredOnly", "Instance", "Public", "NonPublic")
      : bf.$Flags("DeclaredOnly", "Instance", "Public")
    );
    return this.get_DeclaringType().GetMethod(methodName, bindingFlags);
  };

  $.Method({Static: false, Public: true }, "GetAddMethod", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.MethodInfo"), [], [])),
    getAddMethodImpl
  );

  $.Method({Static: false, Public: true }, "GetAddMethod", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.MethodInfo"), [$.Boolean], [])),
    getAddMethodImpl
  );

  $.Method({Static: false, Public: true }, "GetRemoveMethod", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.MethodInfo"), [], [])),
    getRemoveMethodImpl
  );

  $.Method({Static: false, Public: true }, "GetRemoveMethod", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.MethodInfo"), [$.Boolean], [])),
    getRemoveMethodImpl
  );

  $.Method({Static:false, Public:true , Virtual:true }, "AddEventHandler", 
    new JSIL.MethodSignature(null, [$.Object, $jsilcore.TypeRef("System.Delegate")], []), 
    function AddEventHandler (target, handler) {
      var method = this.GetAddMethod();
      method.Invoke(target, [handler]);
    }
  );

  $.Method({Static:false, Public:true , Virtual:true }, "RemoveEventHandler", 
    new JSIL.MethodSignature(null, [$.Object, $jsilcore.TypeRef("System.Delegate")], []), 
    function RemoveEventHandler (target, handler) {
      var method = this.GetRemoveMethod();
      method.Invoke(target, [handler]);
    }
  );

  $.Method({Static:false, Public:true }, "get_EventType", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Type"), [], [])), 
    function get_EventType () {
      var result = this._cachedEventType;

      if (!result) {
        var method = this.GetAddMethod() || this.GetRemoveMethod();

        if (method) {
          var argumentTypes = method._data.signature.argumentTypes;
          var argumentType = argumentTypes[0];
          result = JSIL.ResolveTypeReference(argumentType, this._typeObject.__Context__)[1];

          this._cachedEventType = result;
        }
      }

      return result;
    }
  );

  $.Method({Static: false, Public: true}, "toString",
    new JSIL.MethodSignature($.String, [], []),
    function () {
      // FIXME: Types are encoded as long names, not short names, which is incompatible with .NET
      // i.e. 'System.Int32 Foo()' instead of 'Int32 Foo()'
      return this.get_EventType().toString() + " " + this.Name;
    }
  );
});

JSIL.MakeEnum(
  "System.Reflection.MemberTypes", true, {
    Constructor: 1, 
    Event: 2, 
    Field: 4, 
    Method: 8, 
    Property: 16, 
    TypeInfo: 32, 
    Custom: 64, 
    NestedType: 128, 
    All: 191
  }, true
);

JSIL.ImplementExternals("System.Attribute", function ($) {
  $.Method({Static:true, Public:true }, "GetCustomAttribute", 
    (new JSIL.MethodSignature($jsilcore.TypeRef("System.Attribute"), [$jsilcore.TypeRef("System.Reflection.Assembly"), $jsilcore.TypeRef("System.Type")], [])), 
    function GetCustomAttribute (assembly, attributeType) {
      // FIXME: Not implemented
      return null;
    }
  );
});

(function AssemblyName$Members () {
  var $, $thisType;
  JSIL.MakeType({
      BaseType: $jsilcore.TypeRef("System.Object"), 
      Name: "System.Reflection.AssemblyName", 
      IsPublic: true, 
      IsReferenceType: true, 
      MaximumConstructorArguments: 2, 
    }, function ($interfaceBuilder) {
    $ = $interfaceBuilder;

    $.ExternalMethod({Static:false, Public:true }, ".ctor", 
      JSIL.MethodSignature.Void
    )
      ;

    $.ExternalMethod({Static:false, Public:true }, ".ctor", 
      JSIL.MethodSignature.Action($.String)
    )      
      ;

    $.ExternalMethod({Static:false, Public:true }, "get_Flags", 
      JSIL.MethodSignature.Return($asm02.TypeRef("System.Reflection.AssemblyNameFlags"))
    )
      ;

    $.ExternalMethod({Static:false, Public:true }, "get_FullName", 
      JSIL.MethodSignature.Return($.String)
    )      
      ;

    $.ExternalMethod({Static:false, Public:true }, "get_Name", 
      JSIL.MethodSignature.Return($.String)
    )      
      ;

    $.ExternalMethod({Static:false, Public:true }, "get_Version", 
      JSIL.MethodSignature.Return($asm02.TypeRef("System.Version"))
    )      
      ;

    $.ExternalMethod({Static:true , Public:true }, "GetAssemblyName", 
      new JSIL.MethodSignature($.Type, [$.String])
    )
      ;

    $.ExternalMethod({Static:false, Public:true }, "set_Flags", 
      JSIL.MethodSignature.Action($asm02.TypeRef("System.Reflection.AssemblyNameFlags"))
    )
      ;

    $.ExternalMethod({Static:false, Public:true }, "set_Name", 
      JSIL.MethodSignature.Action($.String)
    )      
      ;

    $.ExternalMethod({Static:false, Public:true }, "set_Version", 
      JSIL.MethodSignature.Action($asm02.TypeRef("System.Version"))
    )      
      ;

    $.ExternalMethod({Static:false, Public:true , Virtual:true }, "toString", 
      JSIL.MethodSignature.Return($.String)
    )
      ;

    $.Property({Static:false, Public:true }, "Name", $.String)
      ;

    $.Property({Static:false, Public:true }, "Version", $asm02.TypeRef("System.Version"))
      ;

    $.Property({Static:false, Public:true }, "Flags", $asm02.TypeRef("System.Reflection.AssemblyNameFlags"))
      ;

    $.Property({Static:false, Public:true }, "FullName", $.String)
      ;

    $.ImplementInterfaces(
      /* 0 */ $asm02.TypeRef("System.Runtime.InteropServices._AssemblyName"), 
      /* 1 */ $asm02.TypeRef("System.ICloneable"), 
      /* 2 */ $asm02.TypeRef("System.Runtime.Serialization.ISerializable"), 
      /* 3 */ $asm02.TypeRef("System.Runtime.Serialization.IDeserializationCallback")
    );

    return function (newThisType) { $thisType = newThisType; }; 
  });

})();

JSIL.ImplementExternals("System.Reflection.AssemblyName", function ($interfaceBuilder) {
  var $ = $interfaceBuilder;

  $.Method({Static:false, Public:true }, ".ctor", 
    JSIL.MethodSignature.Void, 
    function _ctor () {
      this.set_Name(null);
    }
  );

  $.Method({Static:false, Public:true }, ".ctor", 
    JSIL.MethodSignature.Action($.String), 
    function _ctor (assemblyName) {
      this.set_Name(assemblyName);
    }
  );

  $.Method({Static:false, Public:true }, "get_Flags", 
    JSIL.MethodSignature.Return($jsilcore.TypeRef("System.Reflection.AssemblyNameFlags")), 
    function get_Flags () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "get_FullName", 
    JSIL.MethodSignature.Return($.String), 
    function get_FullName () {
      return this._FullName;
    }
  );

  $.Method({Static:false, Public:true }, "get_Name", 
    JSIL.MethodSignature.Return($.String), 
    function get_Name () {
      return this._Name;
    }
  );

  $.Method({Static:false, Public:true }, "get_Version", 
    JSIL.MethodSignature.Return($jsilcore.TypeRef("System.Version")), 
    function get_Version () {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:true , Public:true }, "GetAssemblyName", 
    new JSIL.MethodSignature($jsilcore.TypeRef("System.Reflection.AssemblyName"), [$.String]), 
    function GetAssemblyName (assemblyFile) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "set_Flags", 
    JSIL.MethodSignature.Action($jsilcore.TypeRef("System.Reflection.AssemblyNameFlags")), 
    function set_Flags (value) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true }, "set_Name", 
    JSIL.MethodSignature.Action($.String), 
    function set_Name (value) {
      this._Name = value;
    }
  );

  $.Method({Static:false, Public:true }, "set_Version", 
    JSIL.MethodSignature.Action($jsilcore.TypeRef("System.Version")), 
    function set_Version (value) {
      throw new Error('Not implemented');
    }
  );

  $.Method({Static:false, Public:true , Virtual:true }, "toString", 
    JSIL.MethodSignature.Return($.String), 
    function toString () {
      throw new Error('Not implemented');
    }
  );

  ; 
});