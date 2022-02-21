---
layout: default
---


# Achtung! Style Attentional Network!

Written by: [@tornikeo](https://github.com/tornikeo) and [@copilot](https://copilot.github.com/)

So, [attention](https://arxiv.org/abs/1706.03762) is dominating the AI field now. Not only for NLP, but also for pretty much [any *computable* task out there](https://arxiv.org/abs/2103.05247). So, why not use this approach for image stylization as well? After all, if a human were to stylize an image by hand, it's very much expected that they would pay attention to different parts of the style image when deciding how to stylize, say the Sun on the content image. 

So, that's what [these guys did](https://arxiv.org/abs/1812.02342v5). They created a network that takes an *arbitrary* content and style image pair, and then tries to find the best way to blend the two -- using attention. 

Let's see how it works. Embedded below is a TensorflowJS application that will use the network described above two artistically render the content image. Click `Stylize!` to begin the process. Note that the warmup will take a few seconds depending on your hardware since it's using [chunky VGG-19](https://arxiv.org/abs/1409.1556) for inference). 

<section>
{% include stylizer.html %}
</section>

## So how's it work?

Well, the real question is how's it work *in* TensorflowJS, given that the original source came from [PyTorch repo](https://github.com/GlebSBrykin/SANET)? 

We (the copilot & me) will also explain the model architecture in detail. 

### The model architecture

An image is worth a ~~1000 words~~ [16x16 words](https://arxiv.org/abs/2010.11929). So, let's see the image of the architecture. 

![Model architecture](/assets/img/model-arch.png)

That's one messy-looking model, but fear not. The copilot and me are going to explain it all. Let's read the image image from left to right. The two inputs are the content ($$I_c$$) and style ($$I_s$$)images. The content image is the image that we want to stylize. The style image is the image that we want to use as a style reference. 

These two inputs are first fed into the frozen `Encoder VGG` network, but only up to the `block4_conv1` and `block5_conv1` layers. This is because we want to use the encoder to extract features of different complexity of from the content and style images. We'll use these features to create a new image that is a blend of the content and style images.
 
The four short horizontal lines, $$F_c^{r_{41}}$$, $$F_c^{r_{51}}$$ and $$F_s^{r_{41}}$$, $$F_s^{r_{51}}$$ are the content and style representations of the content and style images. 

Now, we apply main ingredient to the mix, the attention! The two pairs of similar sized $$r_{41}$$ and $$r_{51}$$ images are pushed through the following equation:


### Header 3

```js
// Javascript code with syntax highlighting.
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l)
  return true;
}
```

```ruby
# Ruby code with syntax highlighting
GitHubPages::Dependencies.gems.each do |gem, version|
  s.add_dependency(gem, "= #{version}")
end
```

#### Header 4

*   This is an unordered list following a header.
*   This is an unordered list following a header.
*   This is an unordered list following a header.

##### Header 5

1.  This is an ordered list following a header.
2.  This is an ordered list following a header.
3.  This is an ordered list following a header.

###### Header 6

| head1        | head two          | three |
|:-------------|:------------------|:------|
| ok           | good swedish fish | nice  |
| out of stock | good and plenty   | nice  |
| ok           | good `oreos`      | hmm   |
| ok           | good `zoute` drop | yumm  |

### There's a horizontal rule below this.

* * *

### Here is an unordered list:

*   Item foo
*   Item bar
*   Item baz
*   Item zip

### And an ordered list:

1.  Item one
1.  Item two
1.  Item three
1.  Item four

### And a nested list:

- level 1 item
  - level 2 item
  - level 2 item
    - level 3 item
    - level 3 item
- level 1 item
  - level 2 item
  - level 2 item
  - level 2 item
- level 1 item
  - level 2 item
  - level 2 item
- level 1 item

### Small image

![Octocat](https://github.githubassets.com/images/icons/emoji/octocat.png)

### Large image

![Branching](https://guides.github.com/activities/hello-world/branching.png)


### Definition lists can be used with HTML syntax.

<dl>
<dt>Name</dt>
<dd>Godzilla</dd>
<dt>Born</dt>
<dd>1952</dd>
<dt>Birthplace</dt>
<dd>Japan</dd>
<dt>Color</dt>
<dd>Green</dd>
</dl>

```
Long, single-line code blocks should not wrap. They should horizontally scroll if they are too long. This line should be long enough to demonstrate this.
```

```
The final element.
```
{% include footer.html %}