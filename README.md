Since router events have been removed in Next 13, it is an alternative solution developed to listen to router changes and additionally capture native window unmount.

Example usage

`usePageUnMount(() => {
  console.log('Hey Marty McFly, Let's Back to The Future 🛹')
})`

or 

`usePageUnMount(() => yourHandlerFunc)`
