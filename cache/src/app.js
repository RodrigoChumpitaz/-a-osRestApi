"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const database_1 = require("./database/database");
const user_routes_1 = __importDefault(require("./routes/users/user.routes"));
const roles_routes_1 = __importDefault(require("./routes/roles/roles.routes"));
const permission_routes_1 = __importDefault(require("./routes/permission/permission.routes"));
const special_routes_1 = __importDefault(require("./routes/users/special.routes"));
const documenType_routes_1 = __importDefault(require("./routes/commons/documentsRoutes/documenType.routes"));
const commons_routes_1 = __importDefault(require("./routes/commons/commons.routes"));
const locals_routes_1 = __importDefault(require("./routes/commons/locals.routes"));
const categoria_routes_1 = __importDefault(require("./routes/categoria/categoria.routes"));
const carta_routes_1 = __importDefault(require("./routes/carta/carta.routes"));
const email_routes_1 = __importDefault(require("./email/email.routes"));
const pedido_routes_1 = __importDefault(require("./routes/orders/pedido.routes"));
const detalle_pedido_routes_1 = __importDefault(require("./routes/orders/detalle-pedido.routes"));
const sales_receipts_routes_1 = __importDefault(require("./routes/sales-receipts/sales-receipts.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const package_json_1 = __importDefault(require("../package.json"));
const dotenv_1 = __importDefault(require("dotenv"));
// inicializaciones
const app = (0, express_1.default)();
const env = env_1.environment;
dotenv_1.default.config();
(0, database_1.connect)();
// settings
app.set('port', env.PORT || 3500);
// middlwares
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS	'],
    origin: '*'
}));
// app.use(passport.initialize());
// passport.use(passportMiddleware);
// get de bienvenida
app.get('/', (req, res) => {
    res.json({
        name: package_json_1.default.name,
        version: package_json_1.default.version,
        description: package_json_1.default.description,
    });
});
// routes
app.use('/users', user_routes_1.default, special_routes_1.default);
app.use('/roles', roles_routes_1.default);
app.use('/permission', permission_routes_1.default);
app.use('/documents', documenType_routes_1.default);
app.use('/commons', commons_routes_1.default, locals_routes_1.default);
app.use('/category', categoria_routes_1.default);
app.use('/carta', carta_routes_1.default);
app.use('/mail', email_routes_1.default);
app.use('/orders', pedido_routes_1.default, detalle_pedido_routes_1.default);
app.use('/sales-receipts', sales_receipts_routes_1.default);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
exports.default = app;
