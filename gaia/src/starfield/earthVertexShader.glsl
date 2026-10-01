precision highp float;

#version version_number
in type in_variable_name;
in type in_variable_name;

out type out_variable_name;

uniform type uniform_name;

unifortm float time;

void main()
{
  // process input(s) and do some weird graphics stuff
  gl_fragColour = vec4(1.0,0.0,1.0,1.0)
  // output processed stuff to output variable
  out_variable_name = weird_stuff_we_processed;
}
