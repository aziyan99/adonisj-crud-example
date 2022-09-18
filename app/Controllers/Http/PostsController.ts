import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import Post from 'App/Models/Post'
import { schema } from '@ioc:Adonis/Core/Validator'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class PostsController {
  public async index({view}: HttpContextContract) {
    const posts = await Post.query().preload('category')

    return view.render('post/index', {
      posts
    })
  }

  public async create({view}: HttpContextContract) {
    const post = {
      title: '',
      body: '',
      categoryId: ''
    }
    const categories = await Category.all()
    return view.render('post/create', {
      post,
      categories
    })
  }

  public async store({request, response, session}: HttpContextContract) {
    const newPostSchema = schema.create({
      title: schema.string(),
      category_id: schema.number(),
      body: schema.string(),
    })
    const payload = await request.validate({ schema: newPostSchema })

    await Post.create({
      title: payload.title,
      slug: string.toSlug(payload.title),
      categoryId: payload.category_id,
      body: payload.body,
    })

    session.flash('success', 'Post created')
    return response.redirect().toRoute('posts.index');
  }

  public async edit({view, params}: HttpContextContract) {
    const post = await Post.findOrFail(params.id)
    const categories = await Category.all()

    return view.render('post/edit', {
      post,
      categories
    })
  }

  public async update({params, request, response, session}: HttpContextContract) {
    const newPostSchema = schema.create({
      title: schema.string(),
      category_id: schema.number(),
      body: schema.string(),
    })
    const payload = await request.validate({ schema: newPostSchema })

    const post = await Post.findOrFail(params.id)
    post.title = payload.title
    post.slug = string.toSlug(payload.title)
    post.categoryId = payload.category_id
    post.body = payload.body
    await post.save()

    session.flash('success', 'Post updated')
    return response.redirect().toRoute('posts.index')
  }

  public async destroy({response, params, session}: HttpContextContract) {
    const post = await Post.findOrFail(params.id)
    await post.delete()

    session.flash('success', 'Post deleted')
    return response.redirect().toRoute('posts.index')
  }
}
