import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

function render_config(mode)
{
    const is_development = (mode === 'development');

    return {
        mode,
        entry: './src/menu.js',
        devtool: false,
        output: {
            filename: is_development ? 'menu.js' : 'menu.min.js',
            library: {
                name: 'menu',
                type: 'umd',
                export: 'default',
            },
        },
        externals: {
            jquery: 'jQuery',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                },
            ],
        },
    };
}

function render_sass(mode, entry)
{
    const is_development = (mode === 'development');
    const filename = is_development ? path.basename(entry, '.sass') + '.css' : path.basename(entry, '.sass') + '.min.css';

    return {
        mode,
        entry,
        devtool: false,
        output: {
            filename: 'a.tmp',
        },
        module: {
            rules: [
                {
                    test: /\.sass$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader',
                    ],
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename,
            }),
        ]
    };
}

export default [
    render_config('development'),
    render_config('production'),
    render_sass('development', './src/theme-flat.sass'),
    render_sass('production', './src/theme-flat.sass'),
];
