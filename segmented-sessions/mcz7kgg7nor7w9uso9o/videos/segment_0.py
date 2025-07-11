from manim import *

class EducationalAnimation(Scene):
    def construct(self):
        title = Text("Understanding the Pythagorean Theorem").scale(0.8)
        subtitle = Text("A² + B² = C²").scale(1.2).next_to(title, DOWN)

        triangle = Polygon(ORIGIN, 3 * RIGHT, 3 * RIGHT + 4 * UP, color=BLUE)
        triangle_label_a = Tex("A", color=WHITE).next_to(triangle.get_vertices()[0], LEFT)
        triangle_label_b = Tex("B", color=WHITE).next_to(triangle.get_vertices()[1], DOWN)
        hypotenuse_label = Tex("C", color=WHITE).next_to(triangle.get_vertices()[2], UP)

        self.play(Write(title))
        self.play(Write(subtitle))
        self.wait(1)

        self.play(Create(triangle))
        self.play(Write(triangle_label_a), Write(triangle_label_b), Write(hypotenuse_label))
        self.wait(1)

        theorem_box = SurroundingRectangle(subtitle, color=YELLOW)
        self.play(Create(theorem_box))
        self.wait(1)

        self.play(FadeOut(title), FadeOut(subtitle), FadeOut(triangle), FadeOut(triangle_label_a), FadeOut(triangle_label_b), FadeOut(hypotenuse_label), FadeOut(theorem_box))
        self.wait(6.4)  # Ensure total duration is 10.4 seconds