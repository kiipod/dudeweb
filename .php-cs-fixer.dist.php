<?php

declare(strict_types=1);

use PhpCsFixer\Config;
use PhpCsFixer\Finder;
use PhpCsFixer\Runner\Parallel\ParallelConfigFactory;

return new Config()
    ->setParallelConfig(ParallelConfigFactory::detect()) // @TODO 4.0 no need to call this manually
    ->setRiskyAllowed(false)
    ->setRules([
        '@PER-CS3x0' => true,
        'new_expression_parentheses' => ['use_parentheses' => false],
        'no_trailing_comma_in_singleline' => true,
        'no_unused_imports' => true,
        'phpdoc_align' => ['align' => 'left'],
        'phpdoc_indent' => true,
        'phpdoc_scalar' => true,
        'phpdoc_separation' => true,
        'phpdoc_trim' => true,
        'phpdoc_trim_consecutive_blank_line_separation' => true,
    ])
    ->setFinder(
        new Finder()
            ->in([
                __DIR__ . '/app',
                __DIR__ . '/bootstrap',
                __DIR__ . '/config',
                __DIR__ . '/database',
                __DIR__ . '/lang',
                __DIR__ . '/resources/views',
                __DIR__ . '/routes',
                __DIR__ . '/tests',
            ])
            ->exclude(['cache', 'ssr'])
            ->notName('*.blade.php')
            ->append([
                __FILE__,
                __DIR__ . '/artisan',
                __DIR__ . '/public/index.php',
            ])
            ->append(new Finder()->in(__DIR__ . '/lang/vendor/moonshine')),
    )
;
