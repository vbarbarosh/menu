import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

// One UMD bundle per entry; the file defines one global named after it
function render_config(mode, name)
{
    const is_development = (mode === 'development');

    return {
        mode,
        entry: `./src/${name}.js`,
        devtool: false,
        output: {
            filename: is_development ? `${name}.js` : `${name}.min.js`,
            library: {
                name,
                type: 'umd',
                export: 'default',
            },
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
    render_config('development', 'menu'),
    render_config('production', 'menu'),
    render_config('development', 'contextmenu'),
    render_config('production', 'contextmenu'),
    render_sass('development', './src/theme-flat.sass'),
    render_sass('production', './src/theme-flat.sass'),
];
