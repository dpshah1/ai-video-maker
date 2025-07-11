

export async function POST(request) {
  console.log('🎬 Starting Manim code generation...')
  
  try {
    const { videoScript, voiceOverDuration, voiceOverUrl } = await request.json()
    
    if (!videoScript) {
      console.log('❌ No video script provided')
      return Response.json({ error: 'No video script provided' }, { status: 400 })
    }

    console.log(`📝 Processing video script (${videoScript.length} characters)...`)
    if (voiceOverDuration) {
      console.log(`⏱️ Voice over duration: ${voiceOverDuration}s - will use for timing`)
    }
    
    const manimCode = await generateManimCode(videoScript, voiceOverDuration)
    
    console.log(`✅ Generated Manim code (${manimCode.length} characters)`)
    
    return Response.json({ 
      success: true, 
      manimCode 
    })

  } catch (error) {
    console.error('💥 Manim generation error:', error)
    return Response.json({ error: 'Manim generation failed' }, { status: 500 })
  }
}

async function generateManimCode(videoScript, voiceOverDuration = null) {
  try {
    console.log(`🔑 Checking OpenAI API key...`)
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set')
    }
    
    console.log(`🤖 Sending request to OpenAI GPT-4o-mini...`)
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'system',
          content: `You are an expert Manim animator who creates beautiful, engaging educational animations in the style of 3Blue1Brown. Generate ONLY Python code with perfect syntax and error-free execution. Create dynamic, informative animations with text, mathematical expressions, and visual storytelling. ALWAYS ensure the code is correct and will run without errors.`
        }, {
          role: 'user',
          content: `Generate Manim Python code for an engaging educational video based on this script:

${videoScript}

${voiceOverDuration ? `TIMING REQUIREMENT: The voice over duration is ${voiceOverDuration} seconds. Your animation must match this duration exactly. Distribute the content evenly across this time period.` : ''}

CRITICAL REQUIREMENTS:
- Output ONLY Python code
- NO markdown formatting
- NO explanatory text before or after the code
- Create engaging, educational animations with text and mathematical expressions
- Use dynamic animations that tell a story
- Include proper titles, subtitles, and explanations
- INCLUDE RICH MATHEMATICAL CONTENT: polynomials, sequences, mathematical notation, variables like n, n+1, etc.
- CLEAN UP THE SCREEN: Remove objects when they're no longer needed
- AVOID OVERLAPPING: Position objects carefully to prevent overlap unless intentional
- INFER AND ADD EXTRA DETAILS: Don't just follow the PDF exactly - add relevant examples, counterexamples, and deeper explanations based on the topic

CODE CORRECTNESS REQUIREMENTS:
- ALWAYS ensure all variables are defined before use
- ALWAYS check that lists/arrays have elements before accessing by index
- ALWAYS create objects before referencing them
- NEVER assume objects exist - always create them first
- ALWAYS use proper error handling patterns
- ALWAYS test logical flow - objects must be created before they can be used
- ALWAYS ensure mathematical expressions are syntactically correct
- ALWAYS verify that all referenced variables are in scope

CONTENT ENHANCEMENT REQUIREMENTS:
- INFER RELATED CONCEPTS: If the topic mentions polynomials, also show factoring, roots, and applications
- ADD EXAMPLES: Provide concrete numerical examples to illustrate abstract concepts
- ADD COUNTEREXAMPLES: Show what doesn't work to clarify what does work
- ADD VISUAL DEMONSTRATIONS: Use graphs, diagrams, and animations to make concepts clear
- ADD STEP-BY-STEP BREAKDOWNS: Break complex concepts into digestible parts
- ADD REAL-WORLD APPLICATIONS: Connect mathematical concepts to practical uses
- ADD HISTORICAL CONTEXT: Mention key mathematicians or discoveries when relevant
- ADD COMPARISONS: Compare different approaches or methods
- ADD PROOFS: Show why things work, not just that they work

MANDATORY MATHEMATICAL CONTENT:
- ALWAYS include concrete numerical examples with calculations
- ALWAYS include step-by-step solutions to problems
- ALWAYS include multiple related equations and formulas
- ALWAYS include variable substitutions and simplifications
- ALWAYS include verification steps to check answers
- ALWAYS include graphical representations when applicable
- ALWAYS include both general formulas and specific examples
- ALWAYS include related mathematical concepts and connections

SCREEN CLEANUP AND POSITIONING REQUIREMENTS:
- ALWAYS remove objects when moving to a new topic: self.play(FadeOut(old_object))
- Use FadeOut() to remove objects that are no longer relevant
- Clear the screen between major sections: self.play(*[FadeOut(obj) for obj in self.mobjects])
- NEVER leave objects on screen that are no longer relevant
- Track all objects created and ensure they are removed when not needed
- Position objects carefully to avoid overlap
- Use .next_to() for proper spacing between related objects
- Use .arrange() for groups of objects
- Use .to_edge() to keep titles and labels out of the way
- Use .move_to() for precise positioning
- Use buff parameter for spacing: .next_to(object, DOWN, buff=0.5)

CRITICAL POSITIONING RULES TO PREVENT OVERLAPPING:
- ALWAYS use buff=0.8 or more for vertical spacing: .next_to(object, DOWN, buff=0.8)
- ALWAYS use buff=1.0 or more for horizontal spacing: .next_to(object, RIGHT, buff=1.0)
- NEVER place objects at the same position - always offset them
- Use .arrange(DOWN, buff=0.6) for groups of equations or terms
- Use .arrange(RIGHT, buff=1.2) for horizontal arrangements
- Keep titles at the very top: .to_edge(UP, buff=0.5)
- Keep explanations well below main content: .next_to(main_content, DOWN, buff=1.0)
- Use different vertical positions for different sections: ORIGIN, DOWN*1.5, DOWN*3
- Clear the screen completely between major sections
- Use VGroup to manage related objects together

MANIM DOCUMENTATION EXAMPLES - Use these syntax patterns as GUIDELINES (adapt as needed for your specific content):

ENHANCED MATHEMATICAL ANIMATIONS:
from manim import *

class EnhancedMathematicalExample(Scene):
    def construct(self):
        # Title with mathematical notation
        title = Text("Polynomial Functions", font_size=48)
        title.to_edge(UP)
        
        # Polynomial definition
        poly_def = MathTex("P(x) = ax^2 + bx + c")
        poly_def.move_to(ORIGIN)
        
        # Animate title and definition
        self.play(Write(title))
        self.wait(1)
        self.play(Write(poly_def))
        self.wait(2)
        
        # Clear screen for next section
        self.play(FadeOut(title), FadeOut(poly_def))
        
        # Specific polynomial
        specific_poly = MathTex("P(x) = x^2 + 3x + 2")
        specific_poly.move_to(ORIGIN)
        
        # Explanation
        explanation = Text("This is a specific quadratic polynomial", font_size=24)
        explanation.next_to(specific_poly, DOWN, buff=0.8)
        
        # Animate new content
        self.play(Write(specific_poly))
        self.play(Write(explanation))
        self.wait(2)
        
        # Clear for next section
        self.play(FadeOut(specific_poly), FadeOut(explanation))
        
        # Add extra example - factoring
        factored = MathTex("P(x) = (x + 1)(x + 2)")
        factored.move_to(ORIGIN)
        
        # Show the connection
        connection = Text("This shows the factored form", font_size=24)
        connection.next_to(factored, DOWN, buff=0.8)
        
        self.play(Write(factored))
        self.play(Write(connection))
        self.wait(2)
        
        # Clear everything
        self.play(FadeOut(factored), FadeOut(connection))

ENHANCED SEQUENCE ANIMATIONS:
from manim import *

class EnhancedSequenceExample(Scene):
    def construct(self):
        # Title
        title = Text("Mathematical Sequences", font_size=48)
        title.to_edge(UP)
        
        # Sequence definition
        seq_def = MathTex("a_n = n^2 + 2n + 1")
        seq_def.move_to(ORIGIN)
        
        # Animate title and definition
        self.play(Write(title))
        self.wait(1)
        self.play(Write(seq_def))
        self.wait(1)
        
        # Clear definition for terms
        self.play(FadeOut(seq_def))
        
        # First few terms - arrange them properly
        terms = VGroup(
            MathTex("a_1 = 1^2 + 2(1) + 1 = 4"),
            MathTex("a_2 = 2^2 + 2(2) + 1 = 9"),
            MathTex("a_3 = 3^2 + 2(3) + 1 = 16"),
            MathTex("a_4 = 4^2 + 2(4) + 1 = 25")
        )
        terms.arrange(DOWN, buff=0.6)
        terms.move_to(ORIGIN)
        
        # Animate terms one by one
        for term in terms:
            self.play(Write(term))
            self.wait(0.5)
        
        self.wait(2)
        
        # Clear everything
        self.play(FadeOut(title), *[FadeOut(term) for term in terms])
        
        # Add pattern recognition
        pattern_title = Text("Pattern Recognition", font_size=36)
        pattern_title.to_edge(UP)
        
        pattern = MathTex("a_n = (n + 1)^2")
        pattern.move_to(ORIGIN)
        
        pattern_explanation = Text("This is a perfect square sequence!", font_size=24)
        pattern_explanation.next_to(pattern, DOWN, buff=0.8)
        
        self.play(Write(pattern_title))
        self.play(Write(pattern))
        self.play(Write(pattern_explanation))
        self.wait(2)
        
        # Clear everything
        self.play(FadeOut(pattern_title), FadeOut(pattern), FadeOut(pattern_explanation))

ENHANCED POLYNOMIAL GRAPHING:
from manim import *

class EnhancedPolynomialGraphing(Scene):
    def construct(self):
        # Create polynomial equation
        equation = MathTex("P(x) = x^2 + 3x + 2")
        equation.to_edge(UP)
        
        # Create axes
        axes = Axes(
            x_range=[-4, 4, 1],
            y_range=[-2, 8, 1],
            x_length=8,
            y_length=6,
            axis_config={"color": BLUE}
        )
        axes.move_to(ORIGIN)
        
        # Create polynomial graph
        graph = axes.plot(lambda x: x**2 + 3*x + 2, color=RED)
        
        # Create labels
        labels = axes.get_axis_labels(x_label="x", y_label="P(x)")
        
        # Animate
        self.play(Write(equation))
        self.play(Create(axes))
        self.play(Write(labels))
        self.play(Create(graph))
        self.wait(2)
        
        # Clear for next section
        self.play(FadeOut(equation), FadeOut(axes), FadeOut(labels), FadeOut(graph))
        
        # Add roots analysis
        roots_title = Text("Finding Roots", font_size=36)
        roots_title.to_edge(UP)
        
        roots_eq = MathTex("x^2 + 3x + 2 = 0")
        roots_eq.move_to(ORIGIN)
        
        factored_roots = MathTex("(x + 1)(x + 2) = 0")
        factored_roots.move_to(DOWN * 1)
        
        solution = MathTex("x = -1 \\text{ or } x = -2")
        solution.move_to(DOWN * 2)
        
        self.play(Write(roots_title))
        self.play(Write(roots_eq))
        self.wait(1)
        self.play(Write(factored_roots))
        self.wait(1)
        self.play(Write(solution))
        self.wait(2)
        
        # Clear everything
        self.play(FadeOut(roots_title), FadeOut(roots_eq), FadeOut(factored_roots), FadeOut(solution))

ENHANCED MATHEMATICAL TRANSFORMATIONS:
from manim import *

class EnhancedMathTransformations(Scene):
    def construct(self):
        # Initial equation
        eq1 = MathTex("n^2 + 2n + 1")
        eq1.move_to(ORIGIN)
        
        # Transform to factored form
        eq2 = MathTex("n^2 + 2n + 1 = (n+1)^2")
        eq2.move_to(ORIGIN)
        
        # Animate transformation
        self.play(Write(eq1))
        self.wait(1)
        self.play(Transform(eq1, eq2))
        self.wait(1)
        
        # Add explanation below
        explanation = Text("This is a perfect square!", font_size=24)
        explanation.next_to(eq1, DOWN, buff=0.8)
        self.play(Write(explanation))
        self.wait(2)
        
        # Clear for next section
        self.play(FadeOut(eq1), FadeOut(explanation))
        
        # Add verification
        verify_title = Text("Verification", font_size=36)
        verify_title.to_edge(UP)
        
        verify1 = MathTex("(n+1)^2 = n^2 + 2n + 1")
        verify1.move_to(ORIGIN)
        
        verify2 = MathTex("= n^2 + 2n + 1")
        verify2.move_to(DOWN * 1)
        
        self.play(Write(verify_title))
        self.play(Write(verify1))
        self.wait(1)
        self.play(Write(verify2))
        self.wait(2)
        
        # Clear everything
        self.play(FadeOut(verify_title), FadeOut(verify1), FadeOut(verify2))

ENHANCED SUMMATION AND SERIES:
from manim import *

class EnhancedSummationExample(Scene):
    def construct(self):
        # Summation notation
        summation = MathTex("\\sum_{i=1}^{n} i^2")
        summation.move_to(ORIGIN)
        
        # Animate
        self.play(Write(summation))
        self.wait(1)
        
        # Clear for expanded form
        self.play(FadeOut(summation))
        
        # Expanded form
        expanded = MathTex("1^2 + 2^2 + 3^2 + \\cdots + n^2")
        expanded.move_to(ORIGIN)
        
        # Animate
        self.play(Write(expanded))
        self.wait(1)
        
        # Clear for formula
        self.play(FadeOut(expanded))
        
        # Formula
        formula = MathTex("\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}")
        formula.move_to(ORIGIN)
        
        # Animate
        self.play(Write(formula))
        self.wait(2)
        
        # Clear everything
        self.play(FadeOut(formula))
        
        # Add example calculation
        example_title = Text("Example: n = 4", font_size=36)
        example_title.to_edge(UP)
        
        example_calc = MathTex("1^2 + 2^2 + 3^2 + 4^2 = 1 + 4 + 9 + 16 = 30")
        example_calc.move_to(ORIGIN)
        
        formula_check = MathTex("\\frac{4(5)(9)}{6} = \\frac{180}{6} = 30")
        formula_check.next_to(example_calc, DOWN, buff=0.8)
        
        self.play(Write(example_title))
        self.play(Write(example_calc))
        self.wait(1)
        self.play(Write(formula_check))
        self.wait(2)
        
        # Clear everything
        self.play(FadeOut(example_title), FadeOut(example_calc), FadeOut(formula_check))

POSITIONING PATTERNS:
# Keep titles at the top with proper spacing
title = Text("Title")
title.to_edge(UP, buff=0.5)

# Position main content in center
main_content = MathTex("x^2 + y^2 = r^2")
main_content.move_to(ORIGIN)

# Position explanations below with generous spacing
explanation = Text("Explanation")
explanation.next_to(main_content, DOWN, buff=0.8)

# Arrange groups of objects with proper spacing
terms = VGroup(term1, term2, term3)
terms.arrange(DOWN, buff=0.6)

# Clear screen between sections
self.play(FadeOut(old_object1), FadeOut(old_object2))

# Clear all objects
self.play(*[FadeOut(obj) for obj in self.mobjects])

TIMED MATHEMATICAL EXAMPLE:
from manim import *

class TimedMathExample(Scene):
    def construct(self):
        # Total duration: 30 seconds (example)
        # Distribute content evenly across the time
        
        # Section 1: Introduction (0-8 seconds)
        title = Text("Quadratic Equations", font_size=48)
        title.to_edge(UP, buff=0.5)
        
        self.play(Write(title))
        self.wait(2)  # 2 seconds for title
        
        general_form = MathTex("ax^2 + bx + c = 0")
        general_form.move_to(ORIGIN)
        
        explanation = Text("General form of a quadratic equation", font_size=24)
        explanation.next_to(general_form, DOWN, buff=0.8)
        
        self.play(Write(general_form))
        self.play(Write(explanation))
        self.wait(3)  # 3 seconds for explanation
        
        # Clear for next section
        self.play(FadeOut(general_form), FadeOut(explanation))
        self.wait(1)  # 1 second transition
        
        # Section 2: Example (8-20 seconds)
        specific_eq = MathTex("x^2 + 5x + 6 = 0")
        specific_eq.move_to(ORIGIN)
        
        self.play(Write(specific_eq))
        self.wait(2)  # 2 seconds for equation
        
        # Step-by-step solution
        step1 = MathTex("x^2 + 5x + 6 = 0")
        step1.move_to(UP * 1.5)
        
        step2 = MathTex("(x + 2)(x + 3) = 0")
        step2.move_to(ORIGIN)
        
        step3 = MathTex("x + 2 = 0 \\text{ or } x + 3 = 0")
        step3.move_to(DOWN * 1.5)
        
        step4 = MathTex("x = -2 \\text{ or } x = -3")
        step4.move_to(DOWN * 3)
        
        self.play(Write(step1))
        self.wait(1)
        self.play(Write(step2))
        self.wait(1)
        self.play(Write(step3))
        self.wait(1)
        self.play(Write(step4))
        self.wait(2)  # 6 seconds total for steps
        
        # Clear for final section
        self.play(FadeOut(specific_eq), FadeOut(step1), FadeOut(step2), FadeOut(step3), FadeOut(step4))
        self.wait(1)  # 1 second transition
        
        # Section 3: Verification (20-30 seconds)
        verify_title = Text("Verification", font_size=36)
        verify_title.to_edge(UP, buff=0.5)
        
        verify1 = MathTex("\\text{For } x = -2:")
        verify1.move_to(UP * 1.5)
        
        verify2 = MathTex("(-2)^2 + 5(-2) + 6 = 4 - 10 + 6 = 0")
        verify2.move_to(ORIGIN)
        
        verify3 = MathTex("\\text{For } x = -3:")
        verify3.move_to(DOWN * 1.5)
        
        verify4 = MathTex("(-3)^2 + 5(-3) + 6 = 9 - 15 + 6 = 0")
        verify4.move_to(DOWN * 3)
        
        self.play(Write(verify_title))
        self.play(Write(verify1))
        self.wait(1)
        self.play(Write(verify2))
        self.wait(1)
        self.play(Write(verify3))
        self.wait(1)
        self.play(Write(verify4))
        self.wait(2)  # 6 seconds for verification
        
        # Clear everything
        self.play(FadeOut(verify_title), FadeOut(verify1), FadeOut(verify2),
                 FadeOut(verify3), FadeOut(verify4))
        self.wait(1)  # Final 1 second

MATHEMATICAL CONTENT REQUIREMENTS:
- Include polynomials: MathTex("P(x) = ax^2 + bx + c")
- Include sequences: MathTex("a_n = n^2 + 2n + 1")
- Include variables: MathTex("n"), MathTex("n+1"), MathTex("n-1")
- Include mathematical operations: MathTex("\\sum_{i=1}^{n} i^2")
- Include fractions: MathTex("\\frac{n+1}{n}")
- Include exponents: MathTex("x^n"), MathTex("2^n")
- Include subscripts: MathTex("a_n"), MathTex("x_i")
- Include mathematical functions: MathTex("f(x) = x^2 + 3x + 2")
- Include equations: MathTex("n^2 + 2n + 1 = (n+1)^2")
- Include inequalities: MathTex("n > 0"), MathTex("x \\geq 0")

MANDATORY MATHEMATICAL EXAMPLES TO INCLUDE:
- ALWAYS show step-by-step calculations: MathTex("2^3 = 2 \\times 2 \\times 2 = 8")
- ALWAYS include verification steps: MathTex("\\text{Check: } 2^3 = 8")
- ALWAYS show multiple approaches: factoring, completing the square, quadratic formula
- ALWAYS include numerical examples: MathTex("\\text{For } n = 3: 3^2 + 2(3) + 1 = 16")
- ALWAYS show patterns: MathTex("1, 4, 9, 16, 25, \\ldots")
- ALWAYS include related formulas: MathTex("\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}")
- ALWAYS show transformations: MathTex("x^2 + 6x + 9 = (x + 3)^2")
- ALWAYS include applications: MathTex("\\text{Area} = \\pi r^2")

CORRECT MATHEMATICAL SYNTAX:
- MathTex("n") - variable n
- MathTex("n+1") - n plus one
- MathTex("n-1") - n minus one
- MathTex("n^2") - n squared
- MathTex("a_n") - a sub n
- MathTex("\\sum_{i=1}^{n} i^2") - summation
- MathTex("\\frac{n+1}{n}") - fraction
- MathTex("P(x) = ax^2 + bx + c") - polynomial
- MathTex("f(x) = x^2 + 3x + 2") - function
- MathTex("n > 0") - inequality
- MathTex("x \\geq 0") - greater than or equal
- MathTex("\\int_{0}^{n} x^2 dx") - integral
- MathTex("\\lim_{n \\to \\infty}") - limit

BASIC CONCEPTS:
from manim import *

class BasicExample(Scene):
    def construct(self):
        # Create a circle
        circle = Circle()
        circle.set_fill(BLUE, opacity=0.5)
        
        # Create text
        text = Text("Hello, World!")
        text.to_edge(UP)
        
        # Create mathematical expression
        equation = MathTex("x^2 + y^2 = r^2")
        equation.move_to(ORIGIN)
        
        # Animate
        self.play(Create(circle))
        self.play(Write(text))
        self.play(Write(equation))
        self.wait(2)

ANIMATIONS:
from manim import *

class AnimationExample(Scene):
    def construct(self):
        # Create objects
        square = Square()
        circle = Circle()
        triangle = Triangle()
        
        # Position objects
        square.move_to(LEFT * 2)
        circle.move_to(ORIGIN)
        triangle.move_to(RIGHT * 2)
        
        # Animate
        self.play(Create(square))
        self.play(Create(circle))
        self.play(Create(triangle))
        
        # Transform
        self.play(Transform(square, circle))
        self.wait(1)
        
        # Fade out
        self.play(FadeOut(square), FadeOut(circle), FadeOut(triangle))

PLOTTING WITH MANIM:
from manim import *

class PlottingExample(Scene):
    def construct(self):
        # Create axes
        axes = Axes(
            x_range=[-3, 3, 1],
            y_range=[-3, 3, 1],
            x_length=6,
            y_length=6,
            axis_config={"color": BLUE}
        )
        
        # Create graph
        graph = axes.plot(lambda x: x**2, color=YELLOW)
        
        # Create labels
        labels = axes.get_axis_labels(x_label="x", y_label="y")
        
        # Animate
        self.play(Create(axes))
        self.play(Write(labels))
        self.play(Create(graph))
        self.wait(2)

TEXT AND MATH EXAMPLES:
from manim import *

class TextMathExample(Scene):
    def construct(self):
        # Title
        title = Text("Mathematical Concepts", font_size=48)
        title.to_edge(UP)
        
        # Mathematical expressions
        equation1 = MathTex("E = mc^2")
        equation1.move_to(ORIGIN)
        
        equation2 = MathTex("\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}")
        equation2.move_to(DOWN * 2)
        
        # Explanation text
        explanation = Text("This is Einstein's famous equation", font_size=24)
        explanation.next_to(equation1, DOWN)
        
        # Animate
        self.play(Write(title))
        self.wait(1)
        self.play(Write(equation1))
        self.play(Write(explanation))
        self.wait(1)
        self.play(Write(equation2))
        self.wait(2)

GEOMETRIC SHAPES:
from manim import *

class ShapesExample(Scene):
    def construct(self):
        # Create shapes
        circle = Circle(radius=0.5, color=BLUE)
        square = Square(side_length=1, color=RED)
        triangle = Triangle(color=GREEN)
        rectangle = Rectangle(width=2, height=1, color=YELLOW)
        
        # Position shapes
        circle.move_to(LEFT * 3)
        square.move_to(LEFT * 1)
        triangle.move_to(RIGHT * 1)
        rectangle.move_to(RIGHT * 3)
        
        # Animate
        self.play(Create(circle))
        self.play(Create(square))
        self.play(Create(triangle))
        self.play(Create(rectangle))
        self.wait(2)

CORRECT SYNTAX PATTERNS:
- Circle(radius=0.5, color=BLUE) - correct
- Square(side_length=1, color=RED) - correct
- Triangle(color=GREEN) - correct
- Rectangle(width=2, height=1, color=YELLOW) - correct
- Dot(point=ORIGIN, color=BLUE) - correct
- Line(start=LEFT, end=RIGHT, color=WHITE) - correct
- Arrow(start=LEFT, end=RIGHT, color=RED) - correct
- Text("Hello", font_size=24) - correct
- MathTex("x^2 + y^2 = r^2", font_size=36) - correct
- Axes(x_range=[-3, 3], y_range=[-3, 3]) - correct
- axes.plot(lambda x: x**2, color=YELLOW) - correct
- axes.get_graph(lambda x: x**2).set_color(BLUE) - correct

ERROR PREVENTION PATTERNS:
- ALWAYS create objects before using them: arrows = [Arrow(...), Arrow(...)]
- ALWAYS check list length: if len(arrows) >= 2: arrows[0], arrows[1]
- ALWAYS define variables: my_object = Circle() before referencing my_object
- ALWAYS use proper object creation: VGroup(object1, object2, object3)
- ALWAYS ensure mathematical expressions are valid: MathTex("x^2 + 1") not MathTex("x^2 +")
- ALWAYS use correct parameter names: Circle(radius=1) not Circle(rad=1)
- ALWAYS ensure proper nesting: self.play(Write(object)) not self.play(Write)

COMMON ERRORS TO AVOID:
- IndexError: list index out of range - ALWAYS check list length before accessing
- NameError: name 'object' is not defined - ALWAYS create objects before using them
- AttributeError: 'NoneType' object has no attribute - ALWAYS ensure objects are created successfully
- SyntaxError in MathTex - ALWAYS ensure mathematical expressions are complete
- TypeError: unsupported operand - ALWAYS use correct parameter types
- ValueError: invalid parameter - ALWAYS use valid parameter values

SAFE CODING PATTERNS:
# Instead of: arrows[0], arrows[1] (may fail)
# Use: 
arrows = [Arrow(...), Arrow(...)]
if len(arrows) >= 2:
    self.play(arrows[0].set_color(RED))
    self.play(arrows[1].set_color(RED))

# Instead of: my_object.set_color(RED) (may fail)
# Use:
my_object = Circle()
self.play(my_object.set_color(RED))

# Instead of: VGroup(obj1, obj2) (may fail)
# Use:
obj1 = Circle()
obj2 = Square()
group = VGroup(obj1, obj2)

ANIMATION METHODS:
- self.play(Create(object)) - creates object with animation
- self.play(Write(text)) - writes text with animation
- self.play(FadeIn(object)) - fades in object
- self.play(FadeOut(object)) - fades out object
- self.play(Transform(object1, object2)) - transforms object1 into object2
- self.play(MoveToTarget(object)) - moves object to target
- self.wait(seconds) - pauses for specified time
- self.add(object) - adds object instantly without animation

POSITIONING METHODS:
- object.move_to(position) - moves object to specific position
- object.to_edge(UP/DOWN/LEFT/RIGHT) - moves object to edge
- object.next_to(other_object, direction) - positions relative to other object
- object.shift(direction * distance) - moves object by relative distance
- object.scale(factor) - scales object
- object.set_color(color) - sets color
- object.set_opacity(value) - sets transparency

COLORS: RED, GREEN, BLUE, YELLOW, WHITE, BLACK, ORANGE, PURPLE, PINK, GRAY
DIRECTIONS: UP, DOWN, LEFT, RIGHT, ORIGIN
POSITIONS: ORIGIN, UP, DOWN, LEFT, RIGHT, UP*2, DOWN*2, etc.

Generate ONLY the Python code, nothing else. Use the syntax patterns from the documentation examples as GUIDELINES (adapt them for your specific content). Make it engaging, educational, and visually appealing like 3Blue1Brown videos. 

CRITICAL REQUIREMENTS:
- INCLUDE RICH MATHEMATICAL CONTENT with polynomials, sequences, variables like n, n+1, and mathematical notation
- ALWAYS CLEAN UP THE SCREEN by removing objects when they're no longer needed
- ALWAYS use generous spacing (buff=0.8 or more) to prevent overlapping
- ALWAYS include step-by-step calculations and numerical examples
- ALWAYS include verification steps and multiple approaches
- ALWAYS use proper positioning with .next_to(), .arrange(), and .to_edge()
- INFER AND ADD EXTRA DETAILS, EXAMPLES, AND RELATED CONCEPTS based on the topic
- Make the video comprehensive and educational with concrete mathematical demonstrations

CODE CORRECTNESS REQUIREMENTS:
- ALWAYS ensure all variables are defined before use
- ALWAYS create objects before referencing them
- ALWAYS check list/array bounds before accessing by index
- ALWAYS use proper error handling patterns
- ALWAYS ensure mathematical expressions are syntactically correct
- NEVER assume objects exist - always create them first
- ALWAYS test logical flow - objects must be created before they can be used

TIMING REQUIREMENTS:
- ALWAYS use self.wait() to control timing between animations
- ALWAYS distribute content evenly across the total duration
- ALWAYS ensure the total animation duration matches the voice over duration
- ALWAYS use appropriate wait times: self.wait(1) for short pauses, self.wait(2) for longer pauses
- ALWAYS clear the screen between major sections to avoid clutter
- ALWAYS plan the timing: if voice over is ${voiceOverDuration || 30} seconds, divide content accordingly
- ALWAYS calculate total wait time: sum of all self.wait() calls should equal voice over duration
- ALWAYS use self.wait() strategically to match voice over pacing
- ALWAYS ensure smooth transitions between sections with appropriate pauses`
        }],
        temperature: 0.1,
        max_tokens: 4000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`📨 Received response from OpenAI API`)
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API')
    }
    
    const responseText = data.choices[0].message.content
    console.log(`📄 Generated ${responseText.length} characters of Manim code`)
    
    return responseText

  } catch (error) {
    console.error('💥 OpenAI API error:', error)
    return `Error generating Manim code: ${error.message}`
  }
} 