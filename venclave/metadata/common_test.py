#!/usr/bin/env python
# coding=utf-8

import unittest

import common


class AccentsTests(unittest.TestCase):

    _testdata = [
            ('leon',  'Léon',  'Leon'),
            ('cheri', 'Chéri', 'Cheri'),
            ('half',  '8½',    '812'),
            ]

    # We actually need this function to create a new scope.  If we declared
    # test_method inline in the for loop, Python scoping would not do what we
    # want.
    def _make_test_method(name, input, output):
        def test_method(self):
            self.assertEqual(common.remove_accents(input), output)
        test_method.__name__ = 'test_' + name
        return test_method

    # In CPython inside class scope locals() returns the class dictionary.
    class_dict = locals()
    for (name, input, output) in _testdata:
        class_dict['test_' + name] = _make_test_method(name, input, output)


if __name__ == '__main__':
    unittest.main()
