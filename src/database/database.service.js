// export const findOne = async ({

//     model,
//     filter  = {},
//     select  = '',
//     options = {}

// })=>{

// let doc= model.findOne(filter)

// if(select.length){
//     doc.select(select)
// }

// if(options.populate){
//     doc.populate(options.populate)
// }

// return doc
// }











const applyQueryOptions = (query, { select = '', options = {} } = {}) => {
    if (select?.length) query.select(select)
    if (options.populate) query.populate(options.populate)
    if (options.sort) query.sort(options.sort)
    if (options.skip !== undefined) query.skip(options.skip)
    if (options.limit !== undefined) query.limit(options.limit)
    if (options.lean) query.lean()
    if (options.session) query.session(options.session)
    return query
}

export const findOne = async ({
    model,
    filter = {},
    select = '',
    options = {}
} = {}) => {
    const query = model.findOne(filter, null, options)
    return applyQueryOptions(query, { select, options })
}

export const find = async ({
    model,
    filter = {},
    select = '',
    options = {}
} = {}) => {
    const query = model.find(filter, null, options)
    return applyQueryOptions(query, { select, options })
}

export const findById = async ({
    model,
    id,
    select = '',
    options = {}
} = {}) => {
    const query = model.findById(id, null, options)
    return applyQueryOptions(query, { select, options })
}

export const insertOne = async ({
    model,
    data = {},
    options = {}
} = {}) => {
    const [doc] = await model.create([data], options)
    return doc
}

export const insertMany = async ({
    model,
    data = [],
    options = {}
} = {}) => {
    return model.insertMany(data, options)
}

export const updateOne = async ({
    model,
    filter = {},
    data = {},
    options = {}
} = {}) => {
    return model.updateOne(filter, data, options)
}

export const updateMany = async ({
    model,
    filter = {},
    data = {},
    options = {}
} = {}) => {
    return model.updateMany(filter, data, options)
}

export const findOneAndUpdate = async ({
    model,
    filter = {},
    data = {},
    select = '',
    options = {}
} = {}) => {
    const query = model.findOneAndUpdate(filter, data, options)
    return applyQueryOptions(query, { select, options })
}

export const findByIdAndUpdate = async ({
    model,
    id,
    data = {},
    select = '',
    options = {}
} = {}) => {
    const query = model.findByIdAndUpdate(id, data, options)
    return applyQueryOptions(query, { select, options })
}

export const deleteOne = async ({
    model,
    filter = {},
    options = {}
} = {}) => {
    return model.deleteOne(filter, options)
}

export const deleteMany = async ({
    model,
    filter = {},
    options = {}
} = {}) => {
    return model.deleteMany(filter, options)
}

export const findOneAndDelete = async ({
    model,
    filter = {},
    select = '',
    options = {}
} = {}) => {
    const query = model.findOneAndDelete(filter, options)
    return applyQueryOptions(query, { select, options })
}

export const findByIdAndDelete = async ({
    model,
    id,
    select = '',
    options = {}
} = {}) => {
    const query = model.findByIdAndDelete(id, options)
    return applyQueryOptions(query, { select, options })
}

export const countDocuments = async ({
    model,
    filter = {},
    options = {}
} = {}) => {
    return model.countDocuments(filter, options)
}

export const exists = async ({
    model,
    filter = {}
} = {}) => {
    return model.exists(filter)
}