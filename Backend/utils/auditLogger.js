const AuditLog = require('../models/AuditLog');

/*
|--------------------------------------------------------------------------
| diffChangedFields
|--------------------------------------------------------------------------
|
| Do plain objects (before/after) compare karke sirf wo fields return karta
| hai jo actually badle hain. Arrays/objects ko JSON.stringify se compare
| karte hain taaki nested values bhi pakde jaayein.
|
| Sensitive ya bade fields (password, image binary data, etc.) ko ignoreKeys
| me daal ke skip kar sakte ho.
|
*/

const stableStringify = (value) => {
  try {
    return JSON.stringify(value);
  } catch (err) {
    return String(value);
  }
};

const diffChangedFields = (beforeObj = {}, afterObj = {}, ignoreKeys = []) => {
  const changes = [];
  const keys = new Set([
    ...Object.keys(beforeObj || {}),
    ...Object.keys(afterObj || {}),
  ]);

  keys.forEach((key) => {
    if (ignoreKeys.includes(key)) return;
    if (['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) return;

    const beforeVal = beforeObj ? beforeObj[key] : undefined;
    const afterVal = afterObj ? afterObj[key] : undefined;

    // undefined -> undefined ya value hi nahi bheji gayi to skip
    if (afterVal === undefined) return;

    if (stableStringify(beforeVal) !== stableStringify(afterVal)) {
      changes.push({
        field: key,
        before: beforeVal === undefined ? null : beforeVal,
        after: afterVal === undefined ? null : afterVal,
      });
    }
  });

  return changes;
};

/*
|--------------------------------------------------------------------------
| logAudit
|--------------------------------------------------------------------------
|
| Fire-and-forget style: audit log likhne me error aaye to bhi original
| request fail nahi honi chahiye, isliye try/catch ke andar hi rakha hai.
| Caller ko sirf await karna hai, throw kabhi nahi karega.
|
*/

const logAudit = async ({
  req,
  action,
  resourceType,
  resourceId = '',
  resourceLabel = '',
  changes = [],
}) => {
  try {
    await AuditLog.create({
      admin: req?.admin?._id,
      adminUsername: req?.admin?.username || 'Unknown',
      action,
      resourceType,
      resourceId: resourceId ? String(resourceId) : '',
      resourceLabel,
      changes,
      ipAddress: req?.ip || '',
    });
  } catch (error) {
    // Audit logging kabhi bhi asli operation ko block nahi karni chahiye
    console.error('Audit log likhne me error:', error.message);
  }
};

module.exports = { logAudit, diffChangedFields };