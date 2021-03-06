include('helma/unittest');
include('helma/skin');

export('testCase');

var testCase = new TestCase('helma/skin');

testCase.testBasic = function() {
    var skin = createSkin('simple');
    assertEqual('simple', render(skin));
    assertEqual('simple', render(skin, {}));
};

testCase.testValue = function() {
    var skin = createSkin('before <% value %> after');
    var context = {value: 'HERE'};
    assertEqual('before HERE after', render(skin, context));
};

testCase.testMacro = function() {
    var skin = createSkin('before <% macro %> after');
    var context = {macro_macro: function () 'HERE'};
    assertEqual('before HERE after', render(skin, context));
};

testCase.testFilter = function() {
    var skin = createSkin('before <% x | filter %> after');
    var context = {filter_filter: function (str) 'HERE'};
    assertEqual('before HERE after', render(skin, context));
};

testCase.testSubskin = function() {
    var skin;
    var context;

    skin = createSkin('a<% subskin sub %>b');
    assertEqual('a', render(skin));

    skin = createSkin('a<% render sub %><% subskin sub %>b');
    assertEqual('ab', render(skin));

    skin = createSkin('a<% s %><% subskin sub %>b');
    context = {s_macro: function(macro, skin) skin.renderSubskin('sub')}
    assertEqual('ab', render(skin, context));
};

testCase.testSubskinWhitespace = function() {
    var skin;

    skin = createSkin('a\n<% subskin sub %>\nb\n');
    assertEqual('a\n', render(skin));

    skin = createSkin('a\n<% render sub %>\n<% subskin sub %>\nb\n');
    assertEqual('a\n\nb\n', render(skin));
};
