test(
  '---- example :: BlockTest ----',

  [
    'ephox.robin.api.dom.DomLook',
    'ephox.robin.api.dom.DomParent',
    'ephox.robin.api.dom.DomStructure',
    'ephox.robin.test.BrowserCheck',
    'ephox.sugar.api.Node',
    'ephox.sugar.api.Traverse'
  ],

  function (DomLook, DomParent, DomStructure, BrowserCheck, Node, Traverse) {
    var check = function (expected, input, look) {
      BrowserCheck.run(input, function (node) {
        var actual = DomParent.sharedOne(look, [ node ]);
        actual.fold(function () {
          assert.fail('Expected a common ' + expected + ' tag');
        }, function (act) {
          assert.eq(expected, Node.name(act));
        });
      });
    };

    var checkNone = function (input, look) {
      BrowserCheck.run(input, function (node) {
        var actual = DomParent.sharedOne(look, [ node ]);
        actual.each(function (a) {
          assert.fail('Expected no common tag matching the look. Received: ' + Node.name(a));
        });
      });
    };
    
    check('p', '<p>this<span class="me"> is it </span></p>', DomLook.selector('p'));
    checkNone('<p>this<span class="me"> is it</span></p>', DomLook.selector('blockquote'));

    check('p', '<p>this<span class="me"> is it </span></p>', DomLook.predicate(function (element) {
      return Node.name(element) === 'p';
    }));

    check('p', '<p>this<span class="me"> is it </span></p>', DomLook.predicate(DomStructure.isBlock));

    BrowserCheck.run('<p>this<span class="child"> is it </span></p>', function (node) {
      var actual = DomParent.sharedOne(DomLook.exact(Traverse.parent(node).getOrDie()), [ node ]);
      actual.fold(function () {
        assert.fail('Expected a common ' + expected + ' tag');
      }, function (act) {
        assert.eq('span', Node.name(act));
      });
    });
  }
);
