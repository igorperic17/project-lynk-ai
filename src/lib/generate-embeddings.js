"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_js_1 = require("@supabase/supabase-js");
var crypto_1 = require("crypto");
var dotenv_1 = require("dotenv");
var promises_1 = require("fs/promises");
var github_slugger_1 = require("github-slugger");
var mdast_util_from_markdown_1 = require("mdast-util-from-markdown");
var mdast_util_mdx_1 = require("mdast-util-mdx");
var mdast_util_to_markdown_1 = require("mdast-util-to-markdown");
var mdast_util_to_string_1 = require("mdast-util-to-string");
var micromark_extension_mdxjs_1 = require("micromark-extension-mdxjs");
require("openai");
var openai_1 = require("openai");
var path_1 = require("path");
var unist_builder_1 = require("unist-builder");
var unist_util_filter_1 = require("unist-util-filter");
var util_1 = require("util");
var yargs_1 = require("yargs");
dotenv_1.default.config();
var ignoredFiles = ['pages/404.mdx'];
/**
 * Extracts ES literals from an `estree` `ObjectExpression`
 * into a plain JavaScript object.
 */
function getObjectFromExpression(node) {
    return node.properties.reduce(function (object, property) {
        var _a;
        if (property.type !== 'Property') {
            return object;
        }
        var key = (property.key.type === 'Identifier' && property.key.name) || undefined;
        var value = (property.value.type === 'Literal' && property.value.value) || undefined;
        if (!key) {
            return object;
        }
        return __assign(__assign({}, object), (_a = {}, _a[key] = value, _a));
    }, {});
}
/**
 * Extracts the `meta` ESM export from the MDX file.
 *
 * This info is akin to frontmatter.
 */
function extractMetaExport(mdxTree) {
    var _a, _b, _c, _d, _e, _f;
    var metaExportNode = mdxTree.children.find(function (node) {
        var _a, _b, _c, _d, _e;
        return (node.type === 'mdxjsEsm' &&
            ((_c = (_b = (_a = node.data) === null || _a === void 0 ? void 0 : _a.estree) === null || _b === void 0 ? void 0 : _b.body[0]) === null || _c === void 0 ? void 0 : _c.type) === 'ExportNamedDeclaration' &&
            ((_d = node.data.estree.body[0].declaration) === null || _d === void 0 ? void 0 : _d.type) === 'VariableDeclaration' &&
            ((_e = node.data.estree.body[0].declaration.declarations[0]) === null || _e === void 0 ? void 0 : _e.id.type) === 'Identifier' &&
            node.data.estree.body[0].declaration.declarations[0].id.name === 'meta');
    });
    if (!metaExportNode) {
        return undefined;
    }
    var objectExpression = (((_c = (_b = (_a = metaExportNode.data) === null || _a === void 0 ? void 0 : _a.estree) === null || _b === void 0 ? void 0 : _b.body[0]) === null || _c === void 0 ? void 0 : _c.type) === 'ExportNamedDeclaration' &&
        ((_d = metaExportNode.data.estree.body[0].declaration) === null || _d === void 0 ? void 0 : _d.type) === 'VariableDeclaration' &&
        ((_e = metaExportNode.data.estree.body[0].declaration.declarations[0]) === null || _e === void 0 ? void 0 : _e.id.type) === 'Identifier' &&
        metaExportNode.data.estree.body[0].declaration.declarations[0].id.name === 'meta' &&
        ((_f = metaExportNode.data.estree.body[0].declaration.declarations[0].init) === null || _f === void 0 ? void 0 : _f.type) ===
            'ObjectExpression' &&
        metaExportNode.data.estree.body[0].declaration.declarations[0].init) ||
        undefined;
    if (!objectExpression) {
        return undefined;
    }
    return getObjectFromExpression(objectExpression);
}
/**
 * Splits a `mdast` tree into multiple trees based on
 * a predicate function. Will include the splitting node
 * at the beginning of each tree.
 *
 * Useful to split a markdown file into smaller sections.
 */
function splitTreeBy(tree, predicate) {
    return tree.children.reduce(function (trees, node) {
        var lastTree = trees.slice(-1)[0];
        if (!lastTree || predicate(node)) {
            var tree_1 = (0, unist_builder_1.u)('root', [node]);
            return trees.concat(tree_1);
        }
        lastTree.children.push(node);
        return trees;
    }, []);
}
/**
 * Processes MDX content for search indexing.
 * It extracts metadata, strips it of all JSX,
 * and splits it into sub-sections based on criteria.
 */
function processMdxForSearch(content) {
    var checksum = (0, crypto_1.createHash)('sha256').update(content).digest('base64');
    var mdxTree = (0, mdast_util_from_markdown_1.fromMarkdown)(content, {
        extensions: [(0, micromark_extension_mdxjs_1.mdxjs)()],
        mdastExtensions: [(0, mdast_util_mdx_1.mdxFromMarkdown)()],
    });
    var meta = extractMetaExport(mdxTree);
    // Remove all MDX elements from markdown
    var mdTree = (0, unist_util_filter_1.filter)(mdxTree, function (node) {
        return ![
            'mdxjsEsm',
            'mdxJsxFlowElement',
            'mdxJsxTextElement',
            'mdxFlowExpression',
            'mdxTextExpression',
        ].includes(node.type);
    });
    if (!mdTree) {
        return {
            checksum: checksum,
            meta: meta,
            sections: [],
        };
    }
    var sectionTrees = splitTreeBy(mdTree, function (node) { return node.type === 'heading'; });
    var slugger = new github_slugger_1.default();
    var sections = sectionTrees.map(function (tree) {
        var firstNode = tree.children[0];
        var heading = firstNode.type === 'heading' ? (0, mdast_util_to_string_1.toString)(firstNode) : undefined;
        var slug = heading ? slugger.slug(heading) : undefined;
        return {
            content: (0, mdast_util_to_markdown_1.toMarkdown)(tree),
            heading: heading,
            slug: slug,
        };
    });
    return {
        checksum: checksum,
        meta: meta,
        sections: sections,
    };
}
function walk(dir, parentPath) {
    return __awaiter(this, void 0, void 0, function () {
        var immediateFiles, recursiveFiles, flattenedFiles;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.readdir)(dir)];
                case 1:
                    immediateFiles = _a.sent();
                    return [4 /*yield*/, Promise.all(immediateFiles.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                            var path, stats, docPath;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        path = (0, path_1.join)(dir, file);
                                        return [4 /*yield*/, (0, promises_1.stat)(path)];
                                    case 1:
                                        stats = _a.sent();
                                        if (stats.isDirectory()) {
                                            docPath = "".concat((0, path_1.basename)(path), ".mdx");
                                            return [2 /*return*/, walk(path, immediateFiles.includes(docPath) ? (0, path_1.join)((0, path_1.dirname)(path), docPath) : parentPath)];
                                        }
                                        else if (stats.isFile()) {
                                            return [2 /*return*/, [
                                                    {
                                                        path: path,
                                                        parentPath: parentPath,
                                                    },
                                                ]];
                                        }
                                        else {
                                            return [2 /*return*/, []];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    recursiveFiles = _a.sent();
                    flattenedFiles = recursiveFiles.reduce(function (all, folderContents) { return all.concat(folderContents); }, []);
                    return [2 /*return*/, flattenedFiles.sort(function (a, b) { return a.path.localeCompare(b.path); })];
            }
        });
    });
}
var BaseEmbeddingSource = /** @class */ (function () {
    function BaseEmbeddingSource(source, path, parentPath) {
        this.source = source;
        this.path = path;
        this.parentPath = parentPath;
    }
    return BaseEmbeddingSource;
}());
var MarkdownEmbeddingSource = /** @class */ (function (_super) {
    __extends(MarkdownEmbeddingSource, _super);
    function MarkdownEmbeddingSource(source, filePath, parentFilePath) {
        var _this = this;
        var path = filePath.replace(/^pages/, '').replace(/\.mdx?$/, '');
        var parentPath = parentFilePath === null || parentFilePath === void 0 ? void 0 : parentFilePath.replace(/^pages/, '').replace(/\.mdx?$/, '');
        _this = _super.call(this, source, path, parentPath) || this;
        _this.filePath = filePath;
        _this.parentFilePath = parentFilePath;
        _this.type = 'markdown';
        return _this;
    }
    MarkdownEmbeddingSource.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contents, _a, checksum, meta, sections;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, promises_1.readFile)(this.filePath, 'utf8')];
                    case 1:
                        contents = _b.sent();
                        _a = processMdxForSearch(contents), checksum = _a.checksum, meta = _a.meta, sections = _a.sections;
                        this.checksum = checksum;
                        this.meta = meta;
                        this.sections = sections;
                        return [2 /*return*/, {
                                checksum: checksum,
                                meta: meta,
                                sections: sections,
                            }];
                }
            });
        });
    };
    return MarkdownEmbeddingSource;
}(BaseEmbeddingSource));
function generateEmbeddings() {
    return __awaiter(this, void 0, void 0, function () {
        var argv, shouldRefresh, supabaseClient, embeddingSources, _a, _i, embeddingSources_1, embeddingSource, type, source, path, parentPath, _b, checksum, meta, sections, _c, fetchPageError, existingPage, existingParentPage, _d, fetchParentPageError_1, parentPage_1, updatePageError_1, deletePageSectionError, _e, fetchParentPageError, parentPage, _f, upsertPageError, page, _g, sections_1, _h, slug, heading, content, input, configuration, openai, embeddingResponse, responseData, _j, insertPageSectionError, pageSection, err_1, updatePageError, err_2;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, yargs_1.default.option('refresh', {
                        alias: 'r',
                        description: 'Refresh data',
                        type: 'boolean',
                    }).argv];
                case 1:
                    argv = _k.sent();
                    shouldRefresh = argv.refresh;
                    if (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
                        !process.env.SUPABASE_SERVICE_ROLE_KEY ||
                        !process.env.OPENAI_KEY) {
                        return [2 /*return*/, console.log('Environment variables NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and OPENAI_KEY are required: skipping embeddings generation')];
                    }
                    supabaseClient = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
                        auth: {
                            persistSession: false,
                            autoRefreshToken: false,
                        },
                    });
                    _a = [[]];
                    return [4 /*yield*/, walk('pages')];
                case 2:
                    embeddingSources = __spreadArray.apply(void 0, _a.concat([(_k.sent())
                            .filter(function (_a) {
                            var path = _a.path;
                            return /\.mdx?$/.test(path);
                        })
                            .filter(function (_a) {
                            var path = _a.path;
                            return !ignoredFiles.includes(path);
                        })
                            .map(function (entry) { return new MarkdownEmbeddingSource('guide', entry.path); }), true]));
                    console.log("Discovered ".concat(embeddingSources.length, " pages"));
                    if (!shouldRefresh) {
                        console.log('Checking which pages are new or have changed');
                    }
                    else {
                        console.log('Refresh flag set, re-generating all pages');
                    }
                    _i = 0, embeddingSources_1 = embeddingSources;
                    _k.label = 3;
                case 3:
                    if (!(_i < embeddingSources_1.length)) return [3 /*break*/, 25];
                    embeddingSource = embeddingSources_1[_i];
                    type = embeddingSource.type, source = embeddingSource.source, path = embeddingSource.path, parentPath = embeddingSource.parentPath;
                    _k.label = 4;
                case 4:
                    _k.trys.push([4, 23, , 24]);
                    return [4 /*yield*/, embeddingSource.load()
                        // Check for existing page in DB and compare checksums
                    ];
                case 5:
                    _b = _k.sent(), checksum = _b.checksum, meta = _b.meta, sections = _b.sections;
                    return [4 /*yield*/, supabaseClient
                            .from('nods_page')
                            .select('id, path, checksum, parentPage:parent_page_id(id, path)')
                            .filter('path', 'eq', path)
                            .limit(1)
                            .maybeSingle()];
                case 6:
                    _c = _k.sent(), fetchPageError = _c.error, existingPage = _c.data;
                    if (fetchPageError) {
                        throw fetchPageError;
                    }
                    if (!(!shouldRefresh && (existingPage === null || existingPage === void 0 ? void 0 : existingPage.checksum) === checksum)) return [3 /*break*/, 10];
                    existingParentPage = existingPage === null || existingPage === void 0 ? void 0 : existingPage.parentPage;
                    if (!((existingParentPage === null || existingParentPage === void 0 ? void 0 : existingParentPage.path) !== parentPath)) return [3 /*break*/, 9];
                    console.log("[".concat(path, "] Parent page has changed. Updating to '").concat(parentPath, "'..."));
                    return [4 /*yield*/, supabaseClient
                            .from('nods_page')
                            .select()
                            .filter('path', 'eq', parentPath)
                            .limit(1)
                            .maybeSingle()];
                case 7:
                    _d = _k.sent(), fetchParentPageError_1 = _d.error, parentPage_1 = _d.data;
                    if (fetchParentPageError_1) {
                        throw fetchParentPageError_1;
                    }
                    return [4 /*yield*/, supabaseClient
                            .from('nods_page')
                            .update({ parent_page_id: parentPage_1 === null || parentPage_1 === void 0 ? void 0 : parentPage_1.id })
                            .filter('id', 'eq', existingPage.id)];
                case 8:
                    updatePageError_1 = (_k.sent()).error;
                    if (updatePageError_1) {
                        throw updatePageError_1;
                    }
                    _k.label = 9;
                case 9: return [3 /*break*/, 24];
                case 10:
                    if (!existingPage) return [3 /*break*/, 12];
                    if (!shouldRefresh) {
                        console.log("[".concat(path, "] Docs have changed, removing old page sections and their embeddings"));
                    }
                    else {
                        console.log("[".concat(path, "] Refresh flag set, removing old page sections and their embeddings"));
                    }
                    return [4 /*yield*/, supabaseClient
                            .from('nods_page_section')
                            .delete()
                            .filter('page_id', 'eq', existingPage.id)];
                case 11:
                    deletePageSectionError = (_k.sent()).error;
                    if (deletePageSectionError) {
                        throw deletePageSectionError;
                    }
                    _k.label = 12;
                case 12: return [4 /*yield*/, supabaseClient
                        .from('nods_page')
                        .select()
                        .filter('path', 'eq', parentPath)
                        .limit(1)
                        .maybeSingle()];
                case 13:
                    _e = _k.sent(), fetchParentPageError = _e.error, parentPage = _e.data;
                    if (fetchParentPageError) {
                        throw fetchParentPageError;
                    }
                    return [4 /*yield*/, supabaseClient
                            .from('nods_page')
                            .upsert({
                            checksum: null,
                            path: path,
                            type: type,
                            source: source,
                            meta: meta,
                            parent_page_id: parentPage === null || parentPage === void 0 ? void 0 : parentPage.id,
                        }, { onConflict: 'path' })
                            .select()
                            .limit(1)
                            .single()];
                case 14:
                    _f = _k.sent(), upsertPageError = _f.error, page = _f.data;
                    if (upsertPageError) {
                        throw upsertPageError;
                    }
                    console.log("[".concat(path, "] Adding ").concat(sections.length, " page sections (with embeddings)"));
                    _g = 0, sections_1 = sections;
                    _k.label = 15;
                case 15:
                    if (!(_g < sections_1.length)) return [3 /*break*/, 21];
                    _h = sections_1[_g], slug = _h.slug, heading = _h.heading, content = _h.content;
                    input = content.replace(/\n/g, ' ');
                    _k.label = 16;
                case 16:
                    _k.trys.push([16, 19, , 20]);
                    configuration = new openai_1.Configuration({
                        apiKey: process.env.OPENAI_KEY,
                    });
                    openai = new openai_1.OpenAIApi(configuration);
                    return [4 /*yield*/, openai.createEmbedding({
                            model: 'text-embedding-ada-002',
                            input: input,
                        })];
                case 17:
                    embeddingResponse = _k.sent();
                    if (embeddingResponse.status !== 200) {
                        throw new Error((0, util_1.inspect)(embeddingResponse.data, false, 2));
                    }
                    responseData = embeddingResponse.data.data[0];
                    return [4 /*yield*/, supabaseClient
                            .from('nods_page_section')
                            .insert({
                            page_id: page.id,
                            slug: slug,
                            heading: heading,
                            content: content,
                            token_count: embeddingResponse.data.usage.total_tokens,
                            embedding: responseData.embedding,
                        })
                            .select()
                            .limit(1)
                            .single()];
                case 18:
                    _j = _k.sent(), insertPageSectionError = _j.error, pageSection = _j.data;
                    if (insertPageSectionError) {
                        throw insertPageSectionError;
                    }
                    return [3 /*break*/, 20];
                case 19:
                    err_1 = _k.sent();
                    // TODO: decide how to better handle failed embeddings
                    console.error("Failed to generate embeddings for '".concat(path, "' page section starting with '").concat(input.slice(0, 40), "...'"));
                    throw err_1;
                case 20:
                    _g++;
                    return [3 /*break*/, 15];
                case 21: return [4 /*yield*/, supabaseClient
                        .from('nods_page')
                        .update({ checksum: checksum })
                        .filter('id', 'eq', page.id)];
                case 22:
                    updatePageError = (_k.sent()).error;
                    if (updatePageError) {
                        throw updatePageError;
                    }
                    return [3 /*break*/, 24];
                case 23:
                    err_2 = _k.sent();
                    console.error("Page '".concat(path, "' or one/multiple of its page sections failed to store properly. Page has been marked with null checksum to indicate that it needs to be re-generated."));
                    console.error(err_2);
                    return [3 /*break*/, 24];
                case 24:
                    _i++;
                    return [3 /*break*/, 3];
                case 25:
                    console.log('Embedding generation complete');
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateEmbeddings()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (err) { return console.error(err); });
